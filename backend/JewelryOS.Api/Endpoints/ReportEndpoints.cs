using JewelryOS.Api.Data;
using JewelryOS.Api.Domain;
using JewelryOS.Api.Services;
using Microsoft.EntityFrameworkCore;

namespace JewelryOS.Api.Endpoints;

public static class ReportEndpoints
{
    public static void Map(WebApplication app, IConfiguration config)
    {
        app.MapGet("/api/health", async (AppDb db) =>
        {
            var ok = await db.Database.CanConnectAsync();
            return ok ? Results.Ok(new { status = "ok", time = DateTime.UtcNow }) : Results.Problem("database unavailable", statusCode: 503);
        }).AllowAnonymous();

        // Sums are done in memory: SQLite cannot aggregate decimals, and store volumes are small.
        app.MapGet("/api/dashboard", async (AppDb db, int days = 30) =>
        {
            days = Math.Clamp(days, 1, 366);
            var settings = await db.Settings.AsNoTracking().SingleAsync();
            var tehranOffset = TimeSpan.FromHours(3.5);
            var todayStartUtc = DateTime.SpecifyKind(DateTime.UtcNow.Add(tehranOffset).Date - tehranOffset, DateTimeKind.Utc);
            var sinceUtc = todayStartUtc.AddDays(-(days - 1));

            var invoices = await db.Invoices.AsNoTracking().Where(i => i.CreatedAt >= sinceUtc && i.Status == InvoiceStatus.Issued)
                .Select(i => new { i.Id, i.CreatedAt, i.GrandTotal, i.TaxTotal }).ToListAsync();
            var ids = invoices.Select(i => i.Id).ToList();
            var lines = await db.InvoiceLines.AsNoTracking().Where(l => ids.Contains(l.InvoiceId))
                .Join(db.Products, l => l.ProductId, p => p.Id, (l, p) => new { p.Category, l.LineTotal, l.WeightGrams, l.Quantity })
                .ToListAsync();

            var products = await db.Products.AsNoTracking().Where(p => p.Status == ProductStatus.Active)
                .Select(p => new { p.Id, p.Sku, p.Name, p.Category, p.StockQuantity, p.WeightGrams, p.Purity, p.TrackingMode }).ToListAsync();

            var rate = await db.PriceRates.AsNoTracking().OrderByDescending(r => r.EffectiveAt).ThenByDescending(r => r.Id).FirstOrDefaultAsync();
            var today = invoices.Where(i => i.CreatedAt >= todayStartUtc).ToList();

            var stockGrams18k = products.Sum(p => p.WeightGrams * p.StockQuantity * p.Purity / 750m);

            return Results.Ok(new
            {
                days,
                currency = settings.CurrencyLabel,
                currentRate = rate?.PricePerGram18k,
                rateUpdatedAt = rate?.EffectiveAt,
                todaySalesTotal = today.Sum(i => i.GrandTotal),
                todayInvoiceCount = today.Count,
                periodSalesTotal = invoices.Sum(i => i.GrandTotal),
                periodInvoiceCount = invoices.Count,
                stockPieces = products.Sum(p => p.StockQuantity),
                stockGrams18k = Math.Round(stockGrams18k, 3),
                stockGoldValue = rate == null ? (decimal?)null : PricingCalculator.Money(stockGrams18k * rate.PricePerGram18k),
                salesByDay = invoices
                    .GroupBy(i => i.CreatedAt.Add(tehranOffset).Date)
                    .Select(g => new { date = g.Key.ToString("yyyy-MM-dd"), total = g.Sum(x => x.GrandTotal), count = g.Count() })
                    .OrderBy(x => x.date),
                salesByCategory = lines.GroupBy(l => l.Category == "" ? "بدون دسته" : l.Category)
                    .Select(g => new { category = g.Key, total = g.Sum(x => x.LineTotal), pieces = g.Sum(x => x.Quantity) })
                    .OrderByDescending(x => x.total),
                stockByCategory = products.GroupBy(p => p.Category == "" ? "بدون دسته" : p.Category)
                    .Select(g => new { category = g.Key, pieces = g.Sum(x => x.StockQuantity), grams = Math.Round(g.Sum(x => x.WeightGrams * x.StockQuantity), 3) })
                    .OrderByDescending(x => x.pieces),
                lowStock = products.Where(p => p.TrackingMode == TrackingMode.Quantity && p.StockQuantity <= settings.LowStockThreshold)
                    .OrderBy(p => p.StockQuantity).Take(20),
            });
        }).RequireAuthorization();

        app.MapGet("/api/audit", async (AppDb db, string? action, int page = 1) =>
        {
            var q = db.AuditEvents.AsNoTracking().AsQueryable();
            if (!string.IsNullOrWhiteSpace(action)) q = q.Where(a => a.Action.StartsWith(action));
            return await q.OrderByDescending(a => a.Id).Skip((Math.Max(page, 1) - 1) * 100).Take(100).ToListAsync();
        }).RequireAuthorization("Owner");

        // Info the owner needs to connect other store devices and to find the database file.
        app.MapGet("/api/system", (HttpContext ctx, AppDb db) =>
        {
            var port = ctx.Connection.LocalPort;
            var addresses = System.Net.NetworkInformation.NetworkInterface.GetAllNetworkInterfaces()
                .Where(n => n.OperationalStatus == System.Net.NetworkInformation.OperationalStatus.Up
                            && n.NetworkInterfaceType != System.Net.NetworkInformation.NetworkInterfaceType.Loopback)
                .SelectMany(n => n.GetIPProperties().UnicastAddresses)
                .Where(a => a.Address.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork)
                .Select(a => $"http://{a.Address}:{port}")
                .Distinct().ToList();
            var dbFile = new Microsoft.Data.Sqlite.SqliteConnectionStringBuilder(db.Database.GetConnectionString()).DataSource;
            return Results.Ok(new
            {
                addresses,
                databaseFile = dbFile,
                version = typeof(ReportEndpoints).Assembly.GetName().Version?.ToString(3),
            });
        }).RequireAuthorization("Owner");

        // SQLite backup: a consistent copy of the live database file, downloadable by the owner.
        app.MapGet("/api/backup", async (AppDb db, System.Security.Claims.ClaimsPrincipal user) =>
        {
            if (!db.Database.IsSqlite()) throw new AppException("پشتیبان‌گیری از اینجا فقط برای پایگاه داده SQLite فعال است.");
            var tmp = Path.Combine(Path.GetTempPath(), $"jewelryos-backup-{DateTime.UtcNow:yyyyMMdd-HHmmss}.db");
            await db.Database.ExecuteSqlRawAsync("VACUUM INTO {0}", tmp);
            var bytes = await File.ReadAllBytesAsync(tmp);
            File.Delete(tmp);
            Audit.Log(db, user.Actor(), "backup.download", "System", null, $"{bytes.Length / 1024} KB");
            await db.SaveChangesAsync();
            return Results.File(bytes, "application/octet-stream", Path.GetFileName(tmp));
        }).RequireAuthorization("Owner");
    }
}
