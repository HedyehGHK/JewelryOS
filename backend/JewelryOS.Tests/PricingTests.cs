using JewelryOS.Api.Domain;
using JewelryOS.Api.Services;
using Xunit;

namespace JewelryOS.Tests;

public class PricingTests
{
    // Worked example (confirm with the store owner and keep in sync with docs/pricing.md):
    // 2 g of 18k at 10,000,000/g, wage 20%, profit 7%, VAT 10% on wage+profit
    //   gold 20,000,000 · wage 4,000,000 · profit 1,680,000 · tax 568,000 → 26,248,000
    private static readonly PricingRules Rules = new(10_000_000m, 7m, 10m, TaxBase.WageAndProfit, 1000m);

    [Fact]
    public void Worked_example_matches_hand_calculation()
    {
        var line = PricingCalculator.PriceLine(new PricingItem(2m, 750, 20m, 0m, 1), Rules);
        Assert.Equal(20_000_000m, line.GoldValue);
        Assert.Equal(4_000_000m, line.WageAmount);
        Assert.Equal(1_680_000m, line.ProfitAmount);
        Assert.Equal(568_000m, line.TaxAmount);
        Assert.Equal(26_248_000m, line.LineTotal);
    }

    [Fact]
    public void Whole_price_tax_base_taxes_gold_too()
    {
        var line = PricingCalculator.PriceLine(new PricingItem(2m, 750, 20m, 0m, 1), Rules with { TaxBase = TaxBase.WholePrice });
        Assert.Equal(2_568_000m, line.TaxAmount);
        Assert.Equal(28_248_000m, line.LineTotal);
    }

    [Fact]
    public void Other_purities_are_scaled_from_18k_rate()
    {
        var line = PricingCalculator.PriceLine(new PricingItem(1m, 875, 0m, 0m, 1), Rules);
        Assert.Equal(11_666_667m, line.GoldValue); // 10,000,000 × 875/750, rounded half away from zero
    }

    [Fact]
    public void Quantity_multiplies_line()
    {
        var one = PricingCalculator.PriceLine(new PricingItem(1m, 750, 3m, 0m, 1), Rules);
        var five = PricingCalculator.PriceLine(new PricingItem(1m, 750, 3m, 0m, 5), Rules);
        Assert.Equal(one.GoldValue * 5, five.GoldValue);
    }

    [Fact]
    public void Stones_are_added_and_taxed_but_get_no_profit()
    {
        var plain = PricingCalculator.PriceLine(new PricingItem(2m, 750, 20m, 0m, 1), Rules);
        var withStone = PricingCalculator.PriceLine(new PricingItem(2m, 750, 20m, 1_000_000m, 1), Rules);
        Assert.Equal(plain.ProfitAmount, withStone.ProfitAmount);
        Assert.Equal(plain.TaxAmount + 100_000m, withStone.TaxAmount);
        Assert.Equal(plain.LineTotal + 1_100_000m, withStone.LineTotal);
    }

    [Fact]
    public void Grand_total_is_rounded_to_unit_and_adjustment_recorded()
    {
        // 0.123 g → gold 1,230,000; wage 5% = 61,500; profit 7% of 1,291,500 = 90,405; tax 10% of 151,905 = 15,191 (15,190.5 rounded up)
        var inv = PricingCalculator.PriceInvoice([new PricingItem(0.123m, 750, 5m, 0m, 1)], Rules);
        Assert.Equal(1_397_096m, inv.Lines[0].LineTotal);
        Assert.Equal(1_397_000m, inv.GrandTotal);
        Assert.Equal(-96m, inv.RoundingAdjustment);
    }

    [Theory]
    [InlineData(0, 750, 10, 1)]
    [InlineData(1, 0, 10, 1)]
    [InlineData(1, 750, 101, 1)]
    [InlineData(1, 750, 10, 0)]
    public void Invalid_inputs_are_rejected(double weight, int purity, double wage, int qty) =>
        Assert.Throws<PricingException>(() => PricingCalculator.PriceLine(new PricingItem((decimal)weight, purity, (decimal)wage, 0, qty), Rules));

    [Fact]
    public void Missing_rate_is_rejected() =>
        Assert.Throws<PricingException>(() => PricingCalculator.PriceLine(new PricingItem(1, 750, 1, 0, 1), Rules with { PricePerGram18k = 0 }));

    [Theory]
    [InlineData("۲٫۳۵", 2.35)]
    [InlineData("2/35", 2.35)]
    [InlineData("1,250,000", 1250000.0)]
    [InlineData("۱٬۲۵۰٬۰۰۰", 1250000.0)]
    [InlineData(" 3.5 ", 3.5)]
    public void Persian_and_mixed_number_formats_parse(string input, double expected)
    {
        Assert.True(NumberText.TryDecimal(input, out var v));
        Assert.Equal((decimal)expected, v);
    }
}
