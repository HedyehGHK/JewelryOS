using JewelryOS.Api.Data;
using JewelryOS.Api.Domain;
using Microsoft.EntityFrameworkCore;

namespace JewelryOS.Api.Services;

public record SaleLineRequest(int ProductId, int Quantity, decimal? WagePercent);
public record SaleRequest(List<SaleLineRequest> Lines, string? CustomerName, string? CustomerPhone, string? Notes);

public static class Inventory
{
    /// <summary>
    /// Atomically changes stock with a conditional UPDATE so two simultaneous requests can never
    /// sell the same piece twice or push stock below zero. Must run inside the caller's transaction.
    /// </summary>
    public static async Task<int> MoveAsync(AppDb db, int productId, int change, MovementType type, string? reason,
        Actor actor, int? invoiceId = null, int? importBatchId = null, CancellationToken ct = default)
    {
        if (change == 0) throw new AppException("مقدار تغییر موجودی نمی‌تواند صفر باشد.");
        var now = DateTime.UtcNow;

        var affected = await db.Products
            .Where(p => p.Id == productId && p.StockQuantity + change >= 0)
            .ExecuteUpdateAsync(s => s
                .SetProperty(p => p.StockQuantity, p => p.StockQuantity + change)
                .SetProperty(p => p.UpdatedAt, now), ct);

        if (affected == 0)
        {
            var exists = await db.Products.AnyAsync(p => p.Id == productId, ct);
            if (!exists) throw new AppException("کالا پیدا نشد.", 404);
            throw new AppException("موجودی کافی نیست؛ ممکن است این کالا همین الان فروخته شده باشد.", 409);
        }

        var balance = await db.Products.Where(p => p.Id == productId).Select(p => p.StockQuantity).SingleAsync(ct);
        db.InventoryMovements.Add(new InventoryMovement
        {
            ProductId = productId, QuantityChange = change, BalanceAfter = balance, Type = type, Reason = reason,
            ActorUserId = actor.Id, ActorName = actor.Name, InvoiceId = invoiceId, ImportBatchId = importBatchId, CreatedAt = now,
        });
        return balance;
    }
}

public class SalesService(AppDb db)
{
    public async Task<(PricingRules Rules, PriceRate Rate, StoreSettings Settings)> CurrentRulesAsync(CancellationToken ct = default)
    {
        var settings = await db.Settings.SingleAsync(ct);
        var now = DateTime.UtcNow;
        var rate = await db.PriceRates.Where(r => r.EffectiveAt <= now)
                       .OrderByDescending(r => r.EffectiveAt).ThenByDescending(r => r.Id).FirstOrDefaultAsync(ct)
                   ?? throw new AppException("ابتدا نرخ روز طلا را در صفحه «نرخ طلا» ثبت کنید.");
        return (new PricingRules(rate.PricePerGram18k, settings.ProfitPercent, settings.TaxPercent, settings.TaxBase, settings.RoundingUnit), rate, settings);
    }

    /// <summary>Prices a cart without saving anything.</summary>
    public async Task<object> QuoteAsync(SaleRequest req, Actor actor, CancellationToken ct = default)
    {
        var (rules, rate, _) = await CurrentRulesAsync(ct);
        var (products, items) = await ResolveLinesAsync(req, actor, ct);
        var price = Price(items, rules);
        return new
        {
            rateId = rate.Id, rules.PricePerGram18k, rules.ProfitPercent, rules.TaxPercent, taxBase = rules.TaxBase.ToString(),
            lines = products.Select((p, i) => new { productId = p.Id, p.Sku, p.Name, quantity = items[i].Quantity, wagePercent = items[i].WagePercent, price = price.Lines[i] }),
            price.GoldTotal, price.WageTotal, price.ProfitTotal, price.StoneTotal, price.TaxTotal, price.RoundingAdjustment, price.GrandTotal,
        };
    }

    public async Task<Invoice> CreateSaleAsync(SaleRequest req, Actor actor, CancellationToken ct = default)
    {
        for (var attempt = 1; ; attempt++)
        {
            try
            {
                return await CreateSaleOnceAsync(req, actor, ct);
            }
            catch (DbUpdateException) when (attempt < 3)
            {
                // Most likely a concurrent invoice took the same number; retry with a fresh number.
                db.ChangeTracker.Clear();
            }
        }
    }

    private async Task<Invoice> CreateSaleOnceAsync(SaleRequest req, Actor actor, CancellationToken ct)
    {
        await using var tx = await db.Database.BeginTransactionAsync(ct);

        var (rules, rate, _) = await CurrentRulesAsync(ct);
        var (products, items) = await ResolveLinesAsync(req, actor, ct);
        var price = Price(items, rules);

        var number = (await db.Invoices.MaxAsync(i => (long?)i.Number, ct) ?? 1000) + 1;
        var invoice = new Invoice
        {
            Number = number,
            CustomerName = Clean(req.CustomerName, 120), CustomerPhone = Clean(req.CustomerPhone, 30), Notes = Clean(req.Notes, 500),
            SellerUserId = actor.Id, SellerName = actor.Name,
            PriceRateId = rate.Id, PricePerGram18k = rules.PricePerGram18k, ProfitPercent = rules.ProfitPercent,
            TaxPercent = rules.TaxPercent, TaxBase = rules.TaxBase,
            GoldTotal = price.GoldTotal, WageTotal = price.WageTotal, ProfitTotal = price.ProfitTotal,
            StoneTotal = price.StoneTotal, TaxTotal = price.TaxTotal, RoundingAdjustment = price.RoundingAdjustment,
            GrandTotal = price.GrandTotal,
        };
        for (var i = 0; i < products.Count; i++)
        {
            var p = products[i]; var lp = price.Lines[i];
            invoice.Lines.Add(new InvoiceLine
            {
                ProductId = p.Id, Sku = p.Sku, ProductName = p.Name, Purity = p.Purity, WeightGrams = p.WeightGrams,
                Quantity = items[i].Quantity, WagePercent = items[i].WagePercent,
                GoldValue = lp.GoldValue, WageAmount = lp.WageAmount, ProfitAmount = lp.ProfitAmount,
                StoneValue = lp.StoneValue, TaxAmount = lp.TaxAmount, LineTotal = lp.LineTotal,
            });
        }
        db.Invoices.Add(invoice);
        await db.SaveChangesAsync(ct); // assigns invoice.Id

        foreach (var line in invoice.Lines)
            await Inventory.MoveAsync(db, line.ProductId, -line.Quantity, MovementType.Sale, $"فاکتور {number}", actor, invoice.Id, ct: ct);

        Audit.Log(db, actor, "invoice.create", "Invoice", invoice.Id, $"فاکتور {number} — مبلغ {invoice.GrandTotal:0}");
        await db.SaveChangesAsync(ct);
        await tx.CommitAsync(ct);
        return invoice;
    }

    /// <summary>Voids (cancel) or returns an invoice. Stock comes back via compensating movements; nothing is deleted.</summary>
    public async Task<Invoice> CloseAsync(int invoiceId, InvoiceStatus newStatus, string reason, Actor actor, CancellationToken ct = default)
    {
        if (newStatus is not (InvoiceStatus.Voided or InvoiceStatus.Returned)) throw new AppException("وضعیت نامعتبر.");
        if (string.IsNullOrWhiteSpace(reason)) throw new AppException("دلیل ابطال/مرجوعی را بنویسید.");

        await using var tx = await db.Database.BeginTransactionAsync(ct);
        var inv = await db.Invoices.Include(i => i.Lines).SingleOrDefaultAsync(i => i.Id == invoiceId, ct)
                  ?? throw new AppException("فاکتور پیدا نشد.", 404);

        // Conditional status change guards against two people voiding the same invoice at once.
        var now = DateTime.UtcNow;
        var changed = await db.Invoices.Where(i => i.Id == invoiceId && i.Status == InvoiceStatus.Issued)
            .ExecuteUpdateAsync(s => s
                .SetProperty(i => i.Status, newStatus)
                .SetProperty(i => i.ClosedAt, (DateTime?)now)
                .SetProperty(i => i.ClosedByUserId, (int?)actor.Id)
                .SetProperty(i => i.ClosedByName, (string?)actor.Name)
                .SetProperty(i => i.CloseReason, (string?)reason.Trim()), ct);
        if (changed == 0) throw new AppException("این فاکتور قبلاً باطل یا مرجوع شده است.", 409);

        var type = newStatus == InvoiceStatus.Voided ? MovementType.Void : MovementType.Return;
        foreach (var line in inv.Lines)
            await Inventory.MoveAsync(db, line.ProductId, line.Quantity, type, $"فاکتور {inv.Number}: {reason.Trim()}", actor, inv.Id, ct: ct);

        Audit.Log(db, actor, newStatus == InvoiceStatus.Voided ? "invoice.void" : "invoice.return", "Invoice", inv.Id,
            $"فاکتور {inv.Number} — دلیل: {reason.Trim()}");
        await db.SaveChangesAsync(ct);
        await tx.CommitAsync(ct);

        await db.Entry(inv).ReloadAsync(ct);
        return inv;
    }

    private async Task<(List<Product> Products, List<PricingItem> Items)> ResolveLinesAsync(SaleRequest req, Actor actor, CancellationToken ct)
    {
        if (req.Lines is not { Count: > 0 }) throw new AppException("سبد خرید خالی است.");
        if (req.Lines.Count > 100) throw new AppException("تعداد اقلام فاکتور زیاد است.");
        if (req.Lines.Select(l => l.ProductId).Distinct().Count() != req.Lines.Count)
            throw new AppException("یک کالا دو بار در سبد آمده است.");

        var ids = req.Lines.Select(l => l.ProductId).ToList();
        var byId = await db.Products.AsNoTracking().Where(p => ids.Contains(p.Id)).ToDictionaryAsync(p => p.Id, ct);

        var products = new List<Product>(); var items = new List<PricingItem>();
        foreach (var l in req.Lines)
        {
            if (!byId.TryGetValue(l.ProductId, out var p)) throw new AppException("کالا پیدا نشد.", 404);
            if (p.Status != ProductStatus.Active) throw new AppException($"کالای {p.Sku} بایگانی شده است.");
            if (l.Quantity < 1) throw new AppException("تعداد باید حداقل ۱ باشد.");
            if (p.StockQuantity < l.Quantity) throw new AppException($"موجودی کالای {p.Sku} کافی نیست.", 409);

            var wage = p.WagePercent;
            if (l.WagePercent is { } w && w != p.WagePercent)
            {
                if (actor.Role != Role.Owner) throw new AppException("فقط مدیر می‌تواند درصد اجرت را در فاکتور تغییر دهد.", 403);
                wage = w;
            }
            products.Add(p);
            items.Add(new PricingItem(p.WeightGrams, p.Purity, wage, p.StoneValue, l.Quantity));
        }
        return (products, items);
    }

    private static InvoicePrice Price(List<PricingItem> items, PricingRules rules)
    {
        try { return PricingCalculator.PriceInvoice(items, rules); }
        catch (PricingException e) { throw new AppException(e.Message); }
    }

    private static string? Clean(string? s, int max) =>
        string.IsNullOrWhiteSpace(s) ? null : (s.Trim().Length > max ? s.Trim()[..max] : s.Trim());
}
