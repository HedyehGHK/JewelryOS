using JewelryOS.Api.Domain;
using JewelryOS.Api.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace JewelryOS.Api.Data;

/// <summary>Synthetic demo data — not real store records.</summary>
public static class SampleData
{
    public static readonly ParsedProduct[] Products =
    [
        new("R-1001", "انگشتر زنانه طرح برگ", "انگشتر", 750, 3.250m, 18m, 0m, 1, null),
        new("R-1002", "انگشتر نگین‌دار سولیتر", "انگشتر", 750, 2.870m, 22m, 4_500_000m, 1, "نگین زیرکونیا"),
        new("R-1003", "حلقه ساده رینگی", "انگشتر", 750, 4.100m, 12m, 0m, 1, null),
        new("N-2001", "گردنبند زنجیر کارتیه ۴۵ سانت", "گردنبند", 750, 6.420m, 15m, 0m, 1, null),
        new("N-2002", "گردنبند پلاک اسم", "گردنبند", 750, 2.150m, 30m, 0m, 1, "سفارشی"),
        new("N-2003", "آویز قلب ساده", "گردنبند", 750, 1.050m, 20m, 0m, 6, null),
        new("B-3001", "دستبند زنجیری ونیزی", "دستبند", 750, 5.380m, 14m, 0m, 1, null),
        new("B-3002", "النگو ساده تراش‌خورده", "النگو", 750, 9.760m, 9m, 0m, 1, null),
        new("B-3003", "دستبند بچگانه مهره‌ای", "دستبند", 750, 1.640m, 25m, 0m, 4, null),
        new("E-4001", "گوشواره میخی ستاره", "گوشواره", 750, 0.920m, 28m, 0m, 10, null),
        new("E-4002", "گوشواره حلقه‌ای متوسط", "گوشواره", 750, 2.310m, 18m, 0m, 1, null),
        new("E-4003", "گوشواره آویز مروارید", "گوشواره", 750, 1.780m, 24m, 2_800_000m, 1, "مروارید پرورشی"),
        new("S-5001", "سکه پارسیان ۱ گرمی", "سکه پارسیان", 750, 1.000m, 3m, 0m, 20, null),
        new("S-5002", "سکه پارسیان ۵۰۰ سوتی", "سکه پارسیان", 750, 0.500m, 4m, 0m, 15, null),
        new("W-6001", "سرویس کامل طرح گل", "سرویس", 750, 18.450m, 16m, 0m, 1, "گردنبند، دستبند، گوشواره"),
    ];

    public const decimal DemoPricePerGram18k = 9_850_000m; // synthetic rate in Toman
}

public static class Seed
{
    public static async Task RunAsync(AppDb db, IConfiguration config, ILogger logger)
    {
        if (!await db.Settings.AnyAsync())
            db.Settings.Add(new StoreSettings { InvoiceFooter = "از خرید شما سپاسگزاریم." });

        if (!await db.Users.AnyAsync())
        {
            var hasher = new PasswordHasher<User>();
            var username = (config["Seed:AdminUsername"] ?? "admin").Trim().ToLowerInvariant();
            var password = config["Seed:AdminPassword"] ?? "admin1234";
            var admin = new User { Username = username, DisplayName = "مدیر فروشگاه", Role = Role.Owner, MustChangePassword = true };
            admin.PasswordHash = hasher.HashPassword(admin, password);
            db.Users.Add(admin);
            logger.LogWarning("Created first owner account '{User}'. Change its password after the first sign-in.", username);
        }
        await db.SaveChangesAsync();

        if (config.GetValue("Seed:DemoData", false) && !await db.Products.AnyAsync())
        {
            var system = new Actor(0, "داده نمونه", Role.Owner);
            var adminId = await db.Users.Where(u => u.Role == Role.Owner).Select(u => u.Id).FirstAsync();
            if (adminId == 0) adminId = 1;
            var actor = system with { Id = adminId };

            if (config.GetValue("Seed:DemoSeller", true) && !await db.Users.AnyAsync(u => u.Role == Role.Seller))
            {
                var hasher = new PasswordHasher<User>();
                var seller = new User { Username = "seller", DisplayName = "فروشنده نمونه", Role = Role.Seller };
                seller.PasswordHash = hasher.HashPassword(seller, "seller1234");
                db.Users.Add(seller);
            }

            db.PriceRates.Add(new PriceRate
            {
                PricePerGram18k = SampleData.DemoPricePerGram18k, Source = "داده نمونه (ساختگی)",
                CreatedByUserId = adminId, CreatedByName = actor.Name, EffectiveAt = DateTime.UtcNow.AddMinutes(-1),
            });

            var now = DateTime.UtcNow;
            var products = SampleData.Products.Select(s => new Product
            {
                Sku = s.Sku, Name = s.Name, Category = s.Category, Purity = s.Purity, WeightGrams = s.WeightGrams,
                WagePercent = s.WagePercent, StoneValue = s.StoneValue, Notes = s.Notes,
                CreatedAt = now, UpdatedAt = now,
            }).ToList();
            db.Products.AddRange(products);
            await db.SaveChangesAsync();

            await using var tx = await db.Database.BeginTransactionAsync();
            for (var i = 0; i < products.Count; i++)
                if (SampleData.Products[i].Stock > 0)
                    await Inventory.MoveAsync(db, products[i].Id, SampleData.Products[i].Stock, MovementType.Initial, "موجودی اولیه (نمونه)", actor);
            Audit.Log(db, actor, "seed.demo", "System", null, "داده‌های نمونه ساختگی ایجاد شد");
            await db.SaveChangesAsync();
            await tx.CommitAsync();
            logger.LogInformation("Seeded {Count} synthetic demo products.", products.Count);
        }
    }
}
