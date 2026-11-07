using System.Security.Claims;
using System.Text.Json;
using JewelryOS.Api.Data;
using JewelryOS.Api.Domain;
using JewelryOS.Api.Services;
using Microsoft.EntityFrameworkCore;

namespace JewelryOS.Api.Endpoints;

public record CloseInvoiceRequest(string Reason);
public record RevalidateRequest(Dictionary<ImportField, int>? Mapping, bool UpdateExisting = true);
public record CommitRequest(bool UpdateExisting = true);

public static class SalesEndpoints
{
    public static void Map(WebApplication app)
    {
        var sales = app.MapGroup("/api/sales").RequireAuthorization();
        sales.MapPost("/quote", async (SaleRequest req, ClaimsPrincipal user, SalesService svc) =>
            Results.Ok(await svc.QuoteAsync(req, user.Actor())));
        sales.MapPost("/", async (SaleRequest req, ClaimsPrincipal user, SalesService svc) =>
        {
            var inv = await svc.CreateSaleAsync(req, user.Actor());
            return Results.Ok(new { inv.Id, inv.Number });
        });

        // ----- Invoices -----
        var invoices = app.MapGroup("/api/invoices").RequireAuthorization();

        invoices.MapGet("/", async (AppDb db, string? q, InvoiceStatus? status, DateTime? from, DateTime? to, int page = 1) =>
        {
            var query = db.Invoices.AsNoTracking().AsQueryable();
            if (status is { } st) query = query.Where(i => i.Status == st);
            if (from is { } f) query = query.Where(i => i.CreatedAt >= f.ToUniversalTime());
            if (to is { } t) query = query.Where(i => i.CreatedAt < t.ToUniversalTime());
            if (!string.IsNullOrWhiteSpace(q))
            {
                var term = NumberText.LatinDigits(q.Trim());
                long.TryParse(term, out var num);
                query = query.Where(i => i.Number == num || (i.CustomerName != null && i.CustomerName.Contains(term))
                                         || (i.CustomerPhone != null && i.CustomerPhone.Contains(term))
                                         || i.Lines.Any(l => l.Sku == term));
            }
            var size = 50;
            var items = await query.OrderByDescending(i => i.Id).Skip((Math.Max(page, 1) - 1) * size).Take(size)
                .Select(i => new { i.Id, i.Number, status = i.Status.ToString(), i.CustomerName, i.CustomerPhone, i.SellerName,
                    i.GrandTotal, i.CreatedAt, lineCount = i.Lines.Count })
                .ToListAsync();
            return Results.Ok(items);
        });

        invoices.MapGet("/{id:int}", async (int id, AppDb db) =>
            await db.Invoices.AsNoTracking().Include(i => i.Lines).SingleOrDefaultAsync(i => i.Id == id)
            ?? throw new AppException("فاکتور پیدا نشد.", 404));

        invoices.MapGet("/{id:int}/pdf", async (int id, AppDb db, ClaimsPrincipal user, bool? download) =>
        {
            var inv = await db.Invoices.AsNoTracking().Include(i => i.Lines).SingleOrDefaultAsync(i => i.Id == id)
                      ?? throw new AppException("فاکتور پیدا نشد.", 404);
            var settings = await db.Settings.AsNoTracking().SingleAsync();
            var bytes = InvoicePdf.Render(inv, settings);
            Audit.Log(db, user.Actor(), "invoice.pdf", "Invoice", inv.Id, $"فاکتور {inv.Number}");
            await db.SaveChangesAsync();
            return download == true
                ? Results.File(bytes, "application/pdf", $"invoice-{inv.Number}.pdf")
                : Results.File(bytes, "application/pdf");
        });

        invoices.MapPost("/{id:int}/void", async (int id, CloseInvoiceRequest req, ClaimsPrincipal user, SalesService svc) =>
            Results.Ok(await svc.CloseAsync(id, InvoiceStatus.Voided, req.Reason, user.Actor()))).RequireAuthorization("Owner");
        invoices.MapPost("/{id:int}/return", async (int id, CloseInvoiceRequest req, ClaimsPrincipal user, SalesService svc) =>
            Results.Ok(await svc.CloseAsync(id, InvoiceStatus.Returned, req.Reason, user.Actor()))).RequireAuthorization("Owner");

        // ----- Excel import (owner only) -----
        var imports = app.MapGroup("/api/imports").RequireAuthorization("Owner");

        imports.MapGet("/template", (bool? sample) =>
            Results.File(ImportService.BuildTemplate(sample ?? true),
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "JewelryOS-products-template.xlsx"));

        imports.MapGet("/fields", () => ImportService.FieldLabels.Select(kv => new { field = kv.Key.ToString(), label = kv.Value }));

        imports.MapPost("/", async (IFormFile file, ClaimsPrincipal user, ImportService svc, CancellationToken ct) =>
            Results.Ok(Preview(await svc.UploadAsync(file, user.Actor(), ct))))
            .DisableAntiforgery();

        imports.MapGet("/", async (AppDb db) =>
            await db.ImportBatches.AsNoTracking().OrderByDescending(b => b.Id).Take(50)
                .Select(b => new { b.Id, b.FileName, status = b.Status.ToString(), b.UploadedByName, b.UploadedAt, b.TotalRows,
                    b.ErrorRows, b.CreatedCount, b.UpdatedCount, b.SkippedCount, b.CommittedAt })
                .ToListAsync());

        imports.MapGet("/{id:int}", async (int id, AppDb db) =>
        {
            var b = await db.ImportBatches.AsNoTracking().Include(x => x.Rows).SingleOrDefaultAsync(x => x.Id == id)
                    ?? throw new AppException("پیدا نشد.", 404);
            return Results.Ok(Preview(b));
        });

        imports.MapPost("/{id:int}/revalidate", async (int id, RevalidateRequest req, ImportService svc, CancellationToken ct) =>
            Results.Ok(Preview(await svc.RevalidateAsync(id, req.Mapping, req.UpdateExisting, ct))));

        imports.MapPost("/{id:int}/commit", async (int id, CommitRequest req, ClaimsPrincipal user, ImportService svc, CancellationToken ct) =>
            Results.Ok(Preview(await svc.CommitAsync(id, req.UpdateExisting, user.Actor(), ct))));

        imports.MapPost("/{id:int}/discard", async (int id, ClaimsPrincipal user, ImportService svc, CancellationToken ct) =>
        {
            await svc.DiscardAsync(id, user.Actor(), ct);
            return Results.NoContent();
        });
    }

    private static readonly JsonSerializerOptions Json = new(JsonSerializerDefaults.Web)
    {
        Converters = { new System.Text.Json.Serialization.JsonStringEnumConverter() },
    };

    private static object Preview(ImportBatch b)
    {
        var meta = JsonSerializer.Deserialize<ImportMeta>(b.MappingJson, Json)!;
        return new
        {
            b.Id, b.FileName, status = b.Status.ToString(), b.TotalRows, b.ErrorRows, b.CreatedCount, b.UpdatedCount, b.SkippedCount,
            b.UploadedAt, b.CommittedAt,
            headers = meta.Headers,
            mapping = meta.Mapping.ToDictionary(kv => kv.Key.ToString(), kv => kv.Value),
            rows = b.Rows.OrderBy(r => r.RowNumber).Select(r => new
            {
                r.RowNumber, r.Sku, action = r.Action.ToString(), r.Errors,
                cells = JsonSerializer.Deserialize<List<string>>(r.RawJson, Json),
                parsed = r.ParsedJson == null ? null : JsonSerializer.Deserialize<ParsedProduct>(r.ParsedJson, Json),
            }),
        };
    }
}
