using JewelryOS.Api.Domain;
using Microsoft.EntityFrameworkCore;

namespace JewelryOS.Api.Data;

public class AppDb(DbContextOptions<AppDb> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<InventoryMovement> InventoryMovements => Set<InventoryMovement>();
    public DbSet<PriceRate> PriceRates => Set<PriceRate>();
    public DbSet<StoreSettings> Settings => Set<StoreSettings>();
    public DbSet<Invoice> Invoices => Set<Invoice>();
    public DbSet<InvoiceLine> InvoiceLines => Set<InvoiceLine>();
    public DbSet<ImportBatch> ImportBatches => Set<ImportBatch>();
    public DbSet<ImportRow> ImportRows => Set<ImportRow>();
    public DbSet<AuditEvent> AuditEvents => Set<AuditEvent>();

    protected override void ConfigureConventions(ModelConfigurationBuilder b)
    {
        // Money and weights: fixed decimal precision everywhere.
        b.Properties<decimal>().HavePrecision(18, 3);
        b.Properties<Enum>().HaveConversion<string>().HaveMaxLength(32);
    }

    protected override void OnModelCreating(ModelBuilder m)
    {
        m.Entity<User>(e =>
        {
            e.HasIndex(x => x.Username).IsUnique();
            e.Property(x => x.Username).HasMaxLength(64);
            e.Property(x => x.DisplayName).HasMaxLength(128);
        });

        m.Entity<Product>(e =>
        {
            e.HasIndex(x => x.Sku).IsUnique();
            e.Property(x => x.Sku).HasMaxLength(64);
            e.Property(x => x.Name).HasMaxLength(200);
            e.Property(x => x.Category).HasMaxLength(100);
            e.HasIndex(x => x.Category);
            e.ToTable(t => t.HasCheckConstraint("CK_Product_Stock", "StockQuantity >= 0"));
        });

        m.Entity<InventoryMovement>(e =>
        {
            e.HasOne(x => x.Product).WithMany().HasForeignKey(x => x.ProductId).OnDelete(DeleteBehavior.Restrict);
            e.HasIndex(x => x.ProductId);
            e.HasIndex(x => x.InvoiceId);
        });

        m.Entity<PriceRate>().HasIndex(x => x.EffectiveAt);

        m.Entity<Invoice>(e =>
        {
            e.HasIndex(x => x.Number).IsUnique();
            e.HasIndex(x => x.CreatedAt);
            e.HasMany(x => x.Lines).WithOne().HasForeignKey(l => l.InvoiceId).OnDelete(DeleteBehavior.Cascade);
        });

        m.Entity<InvoiceLine>(e =>
        {
            e.HasOne<Product>().WithMany().HasForeignKey(x => x.ProductId).OnDelete(DeleteBehavior.Restrict);
        });

        m.Entity<ImportBatch>(e =>
        {
            e.HasMany(x => x.Rows).WithOne().HasForeignKey(r => r.ImportBatchId).OnDelete(DeleteBehavior.Cascade);
        });

        m.Entity<AuditEvent>().HasIndex(x => x.CreatedAt);
    }
}
