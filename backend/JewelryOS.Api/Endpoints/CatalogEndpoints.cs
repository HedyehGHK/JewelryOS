using System.Security.Claims;
using JewelryOS.Api.Data;
using JewelryOS.Api.Domain;
using JewelryOS.Api.Services;
using Microsoft.EntityFrameworkCore;

namespace JewelryOS.Api.Endpoints;

public record ProductRequest(string Sku, string Name, string? Category, int Purity, decimal WeightGrams, decimal WagePercent,
    decimal StoneValue, TrackingMode TrackingMode, string? Notes, int? InitialStock);
public record AdjustStockRequest(int Change, string Reason);
public record RateRequest(decimal PricePerGram18k, string? Source);
public record SettingsRequest(string StoreName, string? Address, string? Phone, decimal ProfitPercent, decimal TaxPercent,
    TaxBase TaxBase, decimal RoundingUnit, string CurrencyLabel, string? InvoiceFooter, int LowStockThreshold);

public static class CatalogEndpoints
{
    public static void Map(WebApplication app)
    {
        var products = app.MapGroup("/api/products").RequireAuthorization();

        products.MapGet("/", async (AppDb db, string? q, string? category, ProductStatus? status, bool? inStock) =>
        {
            var query = db.Products.AsNoTracking().AsQueryable();
            query = query.Where(p => p.Status == (status ?? ProductStatus.Active));
            if (!string.IsNullOrWhiteSpace(category)) query = query.Where(p => p.Category == category);
            if (inStock == true) query = query.Where(p => p.StockQuantity > 0);
            if (inStock == false) query = query.Where(p => p.StockQuantity == 0);
            if (!string.IsNullOrWhiteSpace(q))
            {
                var term = NumberText.LatinDigits(q.Trim());
                query = query.Where(p => p.Sku.Contains(term) || p.Name.Contains(term) || p.Category.Contains(term));
            }
            return await query.OrderBy(p => p.Category).ThenBy(p => p.Name).Take(1000).ToListAsync();
        });

        products.MapGet("/categories", async (AppDb db) =>
            await db.Products.Where(p => p.Category != "").Select(p => p.Category).Distinct().OrderBy(c => c).ToListAsync());

        products.MapGet("/{id:int}", async (int id, AppDb db) =>
        {
            var p = await db.Products.AsNoTracking().SingleOrDefaultAsync(x => x.Id == id) ?? throw new AppException("کالا پیدا نشد.", 404);
            var movements = await db.InventoryMovements.AsNoTracking().Where(m => m.ProductId == id)
                .OrderByDescending(m => m.Id).Take(100).ToListAsync();
            return Results.Ok(new { product = p, movements });
        });

        products.MapGet("/by-sku/{sku}", async (string sku, AppDb db) =>
        {
            var term = NumberText.LatinDigits(sku.Trim());
            var p = await db.Products.AsNoTracking().SingleOrDefaultAsync(x => x.Sku == term);
            return p is null ? Results.NotFound(new { message = "کالایی با این کد پیدا نشد." }) : Results.Ok(p);
        });

        products.MapPost("/", async (ProductRequest req, ClaimsPrincipal user, AppDb db) =>
        {
            var actor = user.Actor();
            var p = new Product();
            Apply(p, req);
            if (await db.Products.AnyAsync(x => x.Sku == p.Sku)) throw new AppException("کالایی با این کد قبلاً ثبت شده است.", 409);
            var initial = req.InitialStock ?? (req.TrackingMode == TrackingMode.Unique ? 1 : 0);
            if (initial < 0 || (p.TrackingMode == TrackingMode.Unique && initial > 1)) throw new AppException("موجودی اولیه نامعتبر است.");

            await using var tx = await db.Database.BeginTransactionAsync();
            db.Products.Add(p);
            await db.SaveChangesAsync();
            if (initial > 0) await Inventory.MoveAsync(db, p.Id, initial, MovementType.Initial, "موجودی اولیه", actor);
            Audit.Log(db, actor, "product.create", "Product", p.Id, $"{p.Sku} — {p.Name}");
            await db.SaveChangesAsync();
            await tx.CommitAsync();
            return Results.Ok(await db.Products.AsNoTracking().SingleAsync(x => x.Id == p.Id));
        }).RequireAuthorization("Owner");

        products.MapPut("/{id:int}", async (int id, ProductRequest req, ClaimsPrincipal user, AppDb db) =>
        {
            var p = await db.Products.FindAsync(id) ?? throw new AppException("کالا پیدا نشد.", 404);
            var before = Describe(p);
            var oldSku = p.Sku;
            Apply(p, req);
            if (p.Sku != oldSku && await db.Products.AnyAsync(x => x.Sku == p.Sku && x.Id != id))
                throw new AppException("کالایی با این کد قبلاً ثبت شده است.", 409);
            if (p.TrackingMode == TrackingMode.Unique && p.StockQuantity > 1)
                throw new AppException("این کالا بیش از ۱ موجودی دارد و نمی‌تواند «تکی» باشد.");
            p.UpdatedAt = DateTime.UtcNow;
            Audit.Log(db, user.Actor(), "product.update", "Product", p.Id, $"{before} ← {Describe(p)}");
            await db.SaveChangesAsync();
            return Results.Ok(p);
        }).RequireAuthorization("Owner");

        products.MapPost("/{id:int}/adjust", async (int id, AdjustStockRequest req, ClaimsPrincipal user, AppDb db) =>
        {
            if (string.IsNullOrWhiteSpace(req.Reason)) throw new AppException("دلیل اصلاح موجودی را بنویسید.");
            var actor = user.Actor();
            await using var tx = await db.Database.BeginTransactionAsync();
            var balance = await Inventory.MoveAsync(db, id, req.Change, MovementType.Adjustment, req.Reason.Trim(), actor);
            Audit.Log(db, actor, "stock.adjust", "Product", id, $"تغییر {req.Change:+0;-0} — موجودی جدید {balance} — {req.Reason.Trim()}");
            await db.SaveChangesAsync();
            await tx.CommitAsync();
            return Results.Ok(new { stockQuantity = balance });
        }).RequireAuthorization("Owner");

        products.MapPost("/{id:int}/archive", (int id, ClaimsPrincipal user, AppDb db) => SetStatus(id, ProductStatus.Archived, user, db))
            .RequireAuthorization("Owner");
        products.MapPost("/{id:int}/restore", (int id, ClaimsPrincipal user, AppDb db) => SetStatus(id, ProductStatus.Active, user, db))
            .RequireAuthorization("Owner");

        app.MapGet("/api/movements", async (AppDb db, int? productId, int page = 1) =>
        {
            var q = db.InventoryMovements.AsNoTracking().Include(m => m.Product).AsQueryable();
            if (productId is { } pid) q = q.Where(m => m.ProductId == pid);
            var items = await q.OrderByDescending(m => m.Id).Skip((Math.Max(page, 1) - 1) * 50).Take(50)
                .Select(m => new { m.Id, m.ProductId, sku = m.Product!.Sku, productName = m.Product.Name, m.QuantityChange, m.BalanceAfter,
                    type = m.Type.ToString(), m.Reason, m.ActorName, m.InvoiceId, m.ImportBatchId, m.CreatedAt })
                .ToListAsync();
            return Results.Ok(items);
        }).RequireAuthorization();

        // ----- Gold rate -----
        var rates = app.MapGroup("/api/rates").RequireAuthorization();
        rates.MapGet("/", async (AppDb db) =>
        {
            var history = await db.PriceRates.AsNoTracking().OrderByDescending(r => r.EffectiveAt).ThenByDescending(r => r.Id).Take(60).ToListAsync();
            return Results.Ok(new { current = history.FirstOrDefault(r => r.EffectiveAt <= DateTime.UtcNow), history });
        });
        rates.MapPost("/", async (RateRequest req, ClaimsPrincipal user, AppDb db) =>
        {
            if (req.PricePerGram18k <= 0 || req.PricePerGram18k > 100_000_000_000m) throw new AppException("نرخ وارد شده نامعتبر است.");
            var actor = user.Actor();
            var rate = new PriceRate
            {
                PricePerGram18k = Math.Round(req.PricePerGram18k, 0), Source = req.Source?.Trim(),
                CreatedByUserId = actor.Id, CreatedByName = actor.Name, EffectiveAt = DateTime.UtcNow,
            };
            db.PriceRates.Add(rate);
            Audit.Log(db, actor, "rate.create", "PriceRate", null, $"نرخ ۱۸ عیار: {rate.PricePerGram18k:0}");
            await db.SaveChangesAsync();
            return Results.Ok(rate);
        }).RequireAuthorization("Owner");

        // ----- Settings -----
        app.MapGet("/api/settings", async (AppDb db) => await db.Settings.AsNoTracking().SingleAsync()).RequireAuthorization();
        app.MapPut("/api/settings", async (SettingsRequest req, ClaimsPrincipal user, AppDb db) =>
        {
            if (string.IsNullOrWhiteSpace(req.StoreName)) throw new AppException("نام فروشگاه را وارد کنید.");
            if (req.ProfitPercent is < 0 or > 100 || req.TaxPercent is < 0 or > 100) throw new AppException("درصدها باید بین ۰ تا ۱۰۰ باشند.");
            if (req.RoundingUnit < 0) throw new AppException("واحد گرد کردن نامعتبر است.");
            var s = await db.Settings.SingleAsync();
            var before = $"سود {s.ProfitPercent}٪، مالیات {s.TaxPercent}٪ ({s.TaxBase})، گرد {s.RoundingUnit}";
            s.StoreName = req.StoreName.Trim(); s.Address = req.Address?.Trim(); s.Phone = req.Phone?.Trim();
            s.ProfitPercent = req.ProfitPercent; s.TaxPercent = req.TaxPercent; s.TaxBase = req.TaxBase;
            s.RoundingUnit = req.RoundingUnit; s.CurrencyLabel = string.IsNullOrWhiteSpace(req.CurrencyLabel) ? "تومان" : req.CurrencyLabel.Trim();
            s.InvoiceFooter = req.InvoiceFooter?.Trim(); s.LowStockThreshold = Math.Max(0, req.LowStockThreshold);
            s.UpdatedAt = DateTime.UtcNow;
            Audit.Log(db, user.Actor(), "settings.update", "Settings", 1, $"{before} ← سود {s.ProfitPercent}٪، مالیات {s.TaxPercent}٪ ({s.TaxBase})، گرد {s.RoundingUnit}");
            await db.SaveChangesAsync();
            return Results.Ok(s);
        }).RequireAuthorization("Owner");
    }

    private static async Task<IResult> SetStatus(int id, ProductStatus status, ClaimsPrincipal user, AppDb db)
    {
        var p = await db.Products.FindAsync(id) ?? throw new AppException("کالا پیدا نشد.", 404);
        p.Status = status; p.UpdatedAt = DateTime.UtcNow;
        Audit.Log(db, user.Actor(), status == ProductStatus.Archived ? "product.archive" : "product.restore", "Product", id, p.Sku);
        await db.SaveChangesAsync();
        return Results.Ok(p);
    }

    private static void Apply(Product p, ProductRequest r)
    {
        var sku = NumberText.LatinDigits(r.Sku ?? "").Trim();
        if (sku.Length is 0 or > 64) throw new AppException("کد کالا را وارد کنید (حداکثر ۶۴ کاراکتر).");
        if (string.IsNullOrWhiteSpace(r.Name) || r.Name.Length > 200) throw new AppException("نام کالا را وارد کنید.");
        if (r.Purity is < 1 or > 1000) throw new AppException("عیار باید بین ۱ تا ۱۰۰۰ باشد (مثلاً ۷۵۰).");
        if (r.WeightGrams <= 0) throw new AppException("وزن باید بیشتر از صفر باشد.");
        if (r.WagePercent is < 0 or > 100) throw new AppException("درصد اجرت باید بین ۰ تا ۱۰۰ باشد.");
        if (r.StoneValue < 0) throw new AppException("ارزش سنگ نمی‌تواند منفی باشد.");
        p.Sku = sku; p.Name = r.Name.Trim(); p.Category = (r.Category ?? "").Trim(); p.Purity = r.Purity;
        p.WeightGrams = Math.Round(r.WeightGrams, 3); p.WagePercent = r.WagePercent; p.StoneValue = Math.Round(r.StoneValue, 0);
        p.TrackingMode = r.TrackingMode; p.Notes = string.IsNullOrWhiteSpace(r.Notes) ? null : r.Notes.Trim();
    }

    private static string Describe(Product p) =>
        $"{p.Sku}|{p.Name}|{p.Category}|عیار {p.Purity}|{p.WeightGrams:0.###}g|اجرت {p.WagePercent}٪|سنگ {p.StoneValue:0}|{p.TrackingMode}";
}
