using JewelryOS.Api.Data;
using JewelryOS.Api.Domain;
using JewelryOS.Api.Services;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace JewelryOS.Tests;

public sealed class SalesAndImportTests : IDisposable
{
    private readonly SqliteConnection _conn = new("DataSource=:memory:");
    private readonly Actor _owner = new(1, "مدیر", Role.Owner);
    private readonly Actor _seller = new(2, "فروشنده", Role.Seller);

    public SalesAndImportTests()
    {
        _conn.Open();
        using var db = NewDb();
        db.Database.EnsureCreated();
        db.Settings.Add(new StoreSettings { ProfitPercent = 7, TaxPercent = 10, RoundingUnit = 1000 });
        db.Users.AddRange(new User { Id = 1, Username = "o", DisplayName = "مدیر", Role = Role.Owner },
                          new User { Id = 2, Username = "s", DisplayName = "فروشنده", Role = Role.Seller });
        db.PriceRates.Add(new PriceRate { PricePerGram18k = 10_000_000m, EffectiveAt = DateTime.UtcNow.AddMinutes(-5) });
        db.Products.AddRange(
            new Product { Id = 1, Sku = "R-1", Name = "انگشتر", Purity = 750, WeightGrams = 2m, WagePercent = 20m, StockQuantity = 1, TrackingMode = TrackingMode.Unique },
            new Product { Id = 2, Sku = "C-1", Name = "سکه", Purity = 750, WeightGrams = 1m, WagePercent = 3m, StockQuantity = 3, TrackingMode = TrackingMode.Quantity });
        db.SaveChanges();
    }

    private AppDb NewDb() => new(new DbContextOptionsBuilder<AppDb>().UseSqlite(_conn).Options);

    public void Dispose() => _conn.Dispose();

    [Fact]
    public async Task Sale_snapshots_prices_and_decrements_stock()
    {
        await using var db = NewDb();
        var inv = await new SalesService(db).CreateSaleAsync(new([new(1, 1, null)], "مشتری", null, null), _seller);

        Assert.Equal(26_248_000m, inv.GrandTotal);
        Assert.Equal(1001, inv.Number);
        await using var check = NewDb();
        Assert.Equal(0, (await check.Products.FindAsync(1))!.StockQuantity);
        var mv = await check.InventoryMovements.SingleAsync(m => m.InvoiceId == inv.Id);
        Assert.Equal(-1, mv.QuantityChange);
        Assert.Equal(MovementType.Sale, mv.Type);
    }

    [Fact]
    public async Task Unique_item_cannot_be_sold_twice()
    {
        await using (var db1 = NewDb()) await new SalesService(db1).CreateSaleAsync(new([new(1, 1, null)], null, null, null), _seller);
        await using var db2 = NewDb();
        var ex = await Assert.ThrowsAsync<AppException>(() => new SalesService(db2).CreateSaleAsync(new([new(1, 1, null)], null, null, null), _seller));
        Assert.Equal(409, ex.Status);
        await using var check = NewDb();
        Assert.Equal(1, await check.Invoices.CountAsync()); // failed sale left no invoice behind
    }

    [Fact]
    public async Task Conditional_update_blocks_overselling_even_if_precheck_passed()
    {
        // Simulates the race: stock is read as available, then another sale takes it before our UPDATE.
        await using var db = NewDb();
        await using var tx = await db.Database.BeginTransactionAsync();
        await Inventory.MoveAsync(db, 2, -3, MovementType.Sale, null, _seller);
        var ex = await Assert.ThrowsAsync<AppException>(() => Inventory.MoveAsync(db, 2, -1, MovementType.Sale, null, _seller));
        Assert.Equal(409, ex.Status);
    }

    [Fact]
    public async Task Void_restores_stock_with_compensating_movement_and_keeps_invoice()
    {
        int id;
        await using (var db = NewDb()) id = (await new SalesService(db).CreateSaleAsync(new([new(2, 2, null)], null, null, null), _seller)).Id;
        await using (var db = NewDb()) await new SalesService(db).CloseAsync(id, InvoiceStatus.Voided, "اشتباه در ثبت", _owner);

        await using var check = NewDb();
        Assert.Equal(3, (await check.Products.FindAsync(2))!.StockQuantity);
        Assert.Equal(InvoiceStatus.Voided, (await check.Invoices.FindAsync(id))!.Status);
        Assert.Equal(2, await check.InventoryMovements.CountAsync(m => m.InvoiceId == id));

        await using var again = NewDb();
        await Assert.ThrowsAsync<AppException>(() => new SalesService(again).CloseAsync(id, InvoiceStatus.Voided, "دوباره", _owner));
    }

    [Fact]
    public async Task Seller_cannot_override_wage()
    {
        await using var db = NewDb();
        var ex = await Assert.ThrowsAsync<AppException>(() => new SalesService(db).QuoteAsync(new([new(1, 1, 5m)], null, null, null), _seller));
        Assert.Equal(403, ex.Status);
    }

    [Fact]
    public void Import_row_parsing_handles_persian_digits_and_flags_errors()
    {
        var headers = new List<string> { "کد کالا", "نام کالا", "دسته‌بندی", "عیار", "وزن (گرم)", "درصد اجرت", "ارزش سنگ", "نوع (تکی/تعدادی)", "موجودی", "توضیحات" };
        var map = ImportService.AutoMap(headers);
        Assert.Equal(10, map.Count);

        var ok = ImportService.ParseRow(["R-۱۰۱", "انگشتر", "انگشتر", "18", "۳٫۲۵", "۲۰٪", "", "تکی", "", ""], map);
        Assert.Empty(ok.Errors);
        Assert.Equal("R-101", ok.Product!.Sku);
        Assert.Equal(750, ok.Product.Purity);
        Assert.Equal(3.25m, ok.Product.WeightGrams);
        Assert.Equal(20m, ok.Product.WagePercent);
        Assert.Equal(1, ok.Product.Stock);

        var bad = ImportService.ParseRow(["", "انگشتر", "", "750", "abc", "", "", "تکی", "3", ""], map);
        Assert.Null(bad.Product);
        Assert.Contains(bad.Errors, e => e.Contains("کد کالا"));
        Assert.Contains(bad.Errors, e => e.Contains("وزن"));
        Assert.Contains(bad.Errors, e => e.Contains("تکی"));
    }
}
