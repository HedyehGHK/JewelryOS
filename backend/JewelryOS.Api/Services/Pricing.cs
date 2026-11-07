using JewelryOS.Api.Domain;

namespace JewelryOS.Api.Services;

/// <summary>
/// Pricing rules (configurable in Settings — confirm with the store owner):
///   gold value  = weight × price-per-gram(18k) × purity / 750
///   wage (اجرت) = gold value × wage%
///   profit      = (gold value + wage) × profit%          (default 7%)
///   tax (VAT)   = (wage + profit + stones) × tax%        (TaxBase.WageAndProfit, the usual rule in Iran)
///              or (gold + wage + profit + stones) × tax% (TaxBase.WholePrice)
///   line total  = gold + wage + profit + stones + tax
/// Every component is rounded to a whole currency unit (half away from zero).
/// The invoice grand total is then rounded to the nearest RoundingUnit.
/// </summary>
public record PricingRules(decimal PricePerGram18k, decimal ProfitPercent, decimal TaxPercent, TaxBase TaxBase, decimal RoundingUnit);

public record PricingItem(decimal WeightGrams, int Purity, decimal WagePercent, decimal StoneValue, int Quantity);

public record LinePrice(decimal GoldValue, decimal WageAmount, decimal ProfitAmount, decimal StoneValue, decimal TaxAmount, decimal LineTotal);

public record InvoicePrice(
    IReadOnlyList<LinePrice> Lines,
    decimal GoldTotal, decimal WageTotal, decimal ProfitTotal, decimal StoneTotal, decimal TaxTotal,
    decimal RoundingAdjustment, decimal GrandTotal);

public static class PricingCalculator
{
    public const int ReferencePurity = 750;

    public static LinePrice PriceLine(PricingItem item, PricingRules rules)
    {
        Validate(item, rules);

        decimal qty = item.Quantity;
        var gold = Money(item.WeightGrams * rules.PricePerGram18k * item.Purity / ReferencePurity * qty);
        var wage = Money(gold * item.WagePercent / 100m);
        var profit = Money((gold + wage) * rules.ProfitPercent / 100m);
        var stones = Money(item.StoneValue * qty);

        var taxBase = rules.TaxBase == TaxBase.WholePrice
            ? gold + wage + profit + stones
            : wage + profit + stones;
        var tax = Money(taxBase * rules.TaxPercent / 100m);

        return new LinePrice(gold, wage, profit, stones, tax, gold + wage + profit + stones + tax);
    }

    public static InvoicePrice PriceInvoice(IEnumerable<PricingItem> items, PricingRules rules)
    {
        var lines = items.Select(i => PriceLine(i, rules)).ToList();
        if (lines.Count == 0) throw new PricingException("فاکتور باید حداقل یک قلم کالا داشته باشد.");

        var subtotal = lines.Sum(l => l.LineTotal);
        var rounded = RoundToUnit(subtotal, rules.RoundingUnit);
        return new InvoicePrice(
            lines,
            lines.Sum(l => l.GoldValue), lines.Sum(l => l.WageAmount), lines.Sum(l => l.ProfitAmount),
            lines.Sum(l => l.StoneValue), lines.Sum(l => l.TaxAmount),
            rounded - subtotal, rounded);
    }

    public static decimal Money(decimal v) => Math.Round(v, 0, MidpointRounding.AwayFromZero);

    public static decimal RoundToUnit(decimal v, decimal unit)
    {
        if (unit <= 1) return Money(v);
        return Math.Round(v / unit, 0, MidpointRounding.AwayFromZero) * unit;
    }

    private static void Validate(PricingItem item, PricingRules rules)
    {
        if (rules.PricePerGram18k <= 0) throw new PricingException("نرخ روز طلا ثبت نشده است.");
        if (item.WeightGrams <= 0) throw new PricingException("وزن باید بیشتر از صفر باشد.");
        if (item.Purity is < 1 or > 1000) throw new PricingException("عیار نامعتبر است.");
        if (item.WagePercent is < 0 or > 100) throw new PricingException("درصد اجرت باید بین ۰ تا ۱۰۰ باشد.");
        if (item.StoneValue < 0) throw new PricingException("ارزش سنگ نمی‌تواند منفی باشد.");
        if (item.Quantity < 1) throw new PricingException("تعداد باید حداقل ۱ باشد.");
        if (rules.ProfitPercent is < 0 or > 100 || rules.TaxPercent is < 0 or > 100)
            throw new PricingException("درصد سود یا مالیات نامعتبر است.");
    }
}

public class PricingException(string message) : Exception(message);
