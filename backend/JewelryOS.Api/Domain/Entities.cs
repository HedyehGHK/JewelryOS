namespace JewelryOS.Api.Domain;

// All money values are decimal (never float/double). Currency unit is set in StoreSettings (default: Toman).
// All timestamps are stored as UTC DateTime.

public enum Role { Owner, Seller }

public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = "";
    public string DisplayName { get; set; } = "";
    public string PasswordHash { get; set; } = "";
    public Role Role { get; set; }
    public bool IsActive { get; set; } = true;
    public bool MustChangePassword { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

/// <summary>Unique = one physical piece (stock 0 or 1). Quantity = several identical pieces under one SKU.</summary>
public enum TrackingMode { Unique, Quantity }

public enum ProductStatus { Active, Archived }

public class Product
{
    public int Id { get; set; }
    public string Sku { get; set; } = "";
    public string Name { get; set; } = "";
    public string Category { get; set; } = "";
    /// <summary>Gold fineness in thousandths, e.g. 750 = 18 karat.</summary>
    public int Purity { get; set; } = 750;
    public decimal WeightGrams { get; set; }
    /// <summary>Making charge (اجرت) as a percent of the gold value.</summary>
    public decimal WagePercent { get; set; }
    /// <summary>Fixed extra value for stones/attachments (سنگ و اضافات), per piece.</summary>
    public decimal StoneValue { get; set; }
    public TrackingMode TrackingMode { get; set; } = TrackingMode.Unique;
    /// <summary>Changed only through InventoryMovement-producing operations.</summary>
    public int StockQuantity { get; set; }
    public ProductStatus Status { get; set; } = ProductStatus.Active;
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public enum MovementType { Initial, Import, Adjustment, Sale, Void, Return }

public class InventoryMovement
{
    public long Id { get; set; }
    public int ProductId { get; set; }
    public Product? Product { get; set; }
    public int QuantityChange { get; set; }
    public int BalanceAfter { get; set; }
    public MovementType Type { get; set; }
    public string? Reason { get; set; }
    public int? ActorUserId { get; set; }
    public string ActorName { get; set; } = "";
    public int? InvoiceId { get; set; }
    public int? ImportBatchId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class PriceRate
{
    public int Id { get; set; }
    /// <summary>Price of one gram of 18-karat (750) gold.</summary>
    public decimal PricePerGram18k { get; set; }
    public DateTime EffectiveAt { get; set; } = DateTime.UtcNow;
    public string? Source { get; set; }
    public int? CreatedByUserId { get; set; }
    public string CreatedByName { get; set; } = "";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public enum TaxBase
{
    /// <summary>VAT applies to making charge + seller profit (+ stones) — the usual rule for gold in Iran.</summary>
    WageAndProfit,
    /// <summary>VAT applies to the whole price.</summary>
    WholePrice
}

public class StoreSettings
{
    public int Id { get; set; } = 1;
    public string StoreName { get; set; } = "گالری طلا";
    public string? Address { get; set; }
    public string? Phone { get; set; }
    public decimal ProfitPercent { get; set; } = 7m;
    public decimal TaxPercent { get; set; } = 10m;
    public TaxBase TaxBase { get; set; } = TaxBase.WageAndProfit;
    /// <summary>Grand total is rounded to the nearest multiple of this (e.g. 1000). 0 or 1 = no rounding.</summary>
    public decimal RoundingUnit { get; set; } = 1000m;
    public string CurrencyLabel { get; set; } = "تومان";
    public string? InvoiceFooter { get; set; }
    public int LowStockThreshold { get; set; } = 1;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public enum InvoiceStatus { Issued, Voided, Returned }

public class Invoice
{
    public int Id { get; set; }
    public long Number { get; set; }
    public InvoiceStatus Status { get; set; } = InvoiceStatus.Issued;
    public string? CustomerName { get; set; }
    public string? CustomerPhone { get; set; }
    public int SellerUserId { get; set; }
    public string SellerName { get; set; } = "";

    // Snapshot of pricing inputs at sale time — never recalculated afterwards.
    public int PriceRateId { get; set; }
    public decimal PricePerGram18k { get; set; }
    public decimal ProfitPercent { get; set; }
    public decimal TaxPercent { get; set; }
    public TaxBase TaxBase { get; set; }

    public decimal GoldTotal { get; set; }
    public decimal WageTotal { get; set; }
    public decimal ProfitTotal { get; set; }
    public decimal StoneTotal { get; set; }
    public decimal TaxTotal { get; set; }
    public decimal RoundingAdjustment { get; set; }
    public decimal GrandTotal { get; set; }

    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ClosedAt { get; set; }
    public int? ClosedByUserId { get; set; }
    public string? ClosedByName { get; set; }
    public string? CloseReason { get; set; }

    public List<InvoiceLine> Lines { get; set; } = new();
}

public class InvoiceLine
{
    public int Id { get; set; }
    public int InvoiceId { get; set; }
    public int ProductId { get; set; }
    public string Sku { get; set; } = "";
    public string ProductName { get; set; } = "";
    public int Purity { get; set; }
    public decimal WeightGrams { get; set; }
    public int Quantity { get; set; }
    public decimal WagePercent { get; set; }
    public decimal GoldValue { get; set; }
    public decimal WageAmount { get; set; }
    public decimal ProfitAmount { get; set; }
    public decimal StoneValue { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal LineTotal { get; set; }
}

public enum ImportStatus { Previewed, Committed, Discarded }
public enum ImportRowAction { Create, Update, Skip, Error }

public class ImportBatch
{
    public int Id { get; set; }
    public string FileName { get; set; } = "";
    public long FileSizeBytes { get; set; }
    public int UploadedByUserId { get; set; }
    public string UploadedByName { get; set; } = "";
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    public ImportStatus Status { get; set; } = ImportStatus.Previewed;
    public string MappingJson { get; set; } = "{}";
    public int TotalRows { get; set; }
    public int ErrorRows { get; set; }
    public int CreatedCount { get; set; }
    public int UpdatedCount { get; set; }
    public int SkippedCount { get; set; }
    public DateTime? CommittedAt { get; set; }
    public List<ImportRow> Rows { get; set; } = new();
}

public class ImportRow
{
    public long Id { get; set; }
    public int ImportBatchId { get; set; }
    public int RowNumber { get; set; }
    public string? Sku { get; set; }
    public string RawJson { get; set; } = "{}";
    public string? ParsedJson { get; set; }
    public string? Errors { get; set; }
    public ImportRowAction Action { get; set; }
}

public class AuditEvent
{
    public long Id { get; set; }
    public int? ActorUserId { get; set; }
    public string ActorName { get; set; } = "";
    public string Action { get; set; } = "";
    public string ResourceType { get; set; } = "";
    public string? ResourceId { get; set; }
    public string? Summary { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
