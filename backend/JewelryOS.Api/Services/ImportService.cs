using System.Globalization;
using System.Text.Json;
using ClosedXML.Excel;
using JewelryOS.Api.Data;
using JewelryOS.Api.Domain;
using Microsoft.EntityFrameworkCore;

namespace JewelryOS.Api.Services;

public enum ImportField { Sku, Name, Category, Purity, Weight, WagePercent, StoneValue, Tracking, Stock, Notes }

public record ParsedProduct(string Sku, string Name, string Category, int Purity, decimal WeightGrams, decimal WagePercent,
    decimal StoneValue, TrackingMode TrackingMode, int Stock, string? Notes);

public record ImportMeta(List<string> Headers, Dictionary<ImportField, int> Mapping);

/// <summary>
/// Excel onboarding: upload → parse + validate + preview (nothing changes) → owner commits.
/// Re-import policy: rows are matched by SKU. "update" overwrites existing products (stock differences are
/// recorded as Import movements); "skip" leaves existing products untouched. A SKU never creates a duplicate.
/// </summary>
public class ImportService(AppDb db)
{
    public const long MaxFileBytes = 5 * 1024 * 1024;
    public const int MaxRows = 5000;

    public static readonly Dictionary<ImportField, string> FieldLabels = new()
    {
        [ImportField.Sku] = "کد کالا", [ImportField.Name] = "نام کالا", [ImportField.Category] = "دسته‌بندی",
        [ImportField.Purity] = "عیار", [ImportField.Weight] = "وزن (گرم)", [ImportField.WagePercent] = "درصد اجرت",
        [ImportField.StoneValue] = "ارزش سنگ", [ImportField.Tracking] = "نوع (تکی/تعدادی)",
        [ImportField.Stock] = "موجودی", [ImportField.Notes] = "توضیحات",
    };

    private static readonly Dictionary<ImportField, string[]> Aliases = new()
    {
        [ImportField.Sku] = ["کدکالا", "کد", "کدمحصول", "بارکد", "sku", "code", "id"],
        [ImportField.Name] = ["نامکالا", "نام", "شرح", "عنوان", "name", "title"],
        [ImportField.Category] = ["دستهبندی", "دسته", "گروه", "نوع کالا", "category", "type"],
        [ImportField.Purity] = ["عیار", "purity", "karat", "fineness"],
        [ImportField.Weight] = ["وزن(گرم)", "وزن", "وزنگرم", "weight", "weightgrams", "grams"],
        [ImportField.WagePercent] = ["درصداجرت", "اجرت", "اجرت٪", "اجرت%", "wage", "wagepercent", "making"],
        [ImportField.StoneValue] = ["ارزشسنگ", "سنگ", "قیمتسنگ", "stone", "stonevalue"],
        [ImportField.Tracking] = ["نوع(تکی/تعدادی)", "نوع", "تکی/تعدادی", "tracking", "mode"],
        [ImportField.Stock] = ["موجودی", "تعداد", "stock", "qty", "quantity"],
        [ImportField.Notes] = ["توضیحات", "یادداشت", "notes", "description"],
    };

    private static readonly JsonSerializerOptions Json = new(JsonSerializerDefaults.Web)
    {
        Converters = { new System.Text.Json.Serialization.JsonStringEnumConverter() },
    };

    // ---------- Upload & preview ----------

    public async Task<ImportBatch> UploadAsync(IFormFile file, Actor actor, CancellationToken ct)
    {
        if (file.Length == 0) throw new AppException("فایل خالی است.");
        if (file.Length > MaxFileBytes) throw new AppException("حجم فایل باید کمتر از ۵ مگابایت باشد.");
        if (!Path.GetExtension(file.FileName).Equals(".xlsx", StringComparison.OrdinalIgnoreCase))
            throw new AppException("فقط فایل اکسل با پسوند .xlsx پذیرفته می‌شود.");

        List<string> headers; List<(int RowNumber, List<string> Cells)> rows;
        try
        {
            await using var stream = file.OpenReadStream();
            using var wb = new XLWorkbook(stream);
            (headers, rows) = ReadSheet(wb.Worksheets.First());
        }
        catch (AppException) { throw; }
        catch (Exception)
        {
            throw new AppException("فایل اکسل قابل خواندن نیست. مطمئن شوید فایل .xlsx سالم است.");
        }

        var batch = new ImportBatch
        {
            FileName = Path.GetFileName(file.FileName), FileSizeBytes = file.Length,
            UploadedByUserId = actor.Id, UploadedByName = actor.Name,
        };
        var meta = new ImportMeta(headers, AutoMap(headers));
        batch.MappingJson = JsonSerializer.Serialize(meta, Json);
        foreach (var (num, cells) in rows)
            batch.Rows.Add(new ImportRow { RowNumber = num, RawJson = JsonSerializer.Serialize(cells, Json) });

        await ValidateAsync(batch, meta, updateExisting: true, ct);
        db.ImportBatches.Add(batch);
        Audit.Log(db, actor, "import.upload", "ImportBatch", null, $"{batch.FileName} — {batch.TotalRows} ردیف");
        await db.SaveChangesAsync(ct);
        return batch;
    }

    /// <summary>Re-validates a previewed batch with a different column mapping or re-import policy.</summary>
    public async Task<ImportBatch> RevalidateAsync(int batchId, Dictionary<ImportField, int>? mapping, bool updateExisting, CancellationToken ct)
    {
        var batch = await LoadPreviewedAsync(batchId, ct);
        var meta = JsonSerializer.Deserialize<ImportMeta>(batch.MappingJson, Json)!;
        if (mapping != null)
        {
            if (mapping.Values.Any(i => i < -1 || i >= meta.Headers.Count)) throw new AppException("ستون انتخاب‌شده نامعتبر است.");
            meta = meta with { Mapping = mapping.Where(kv => kv.Value >= 0).ToDictionary(kv => kv.Key, kv => kv.Value) };
            batch.MappingJson = JsonSerializer.Serialize(meta, Json);
        }
        await ValidateAsync(batch, meta, updateExisting, ct);
        await db.SaveChangesAsync(ct);
        return batch;
    }

    // ---------- Commit ----------

    public async Task<ImportBatch> CommitAsync(int batchId, bool updateExisting, Actor actor, CancellationToken ct)
    {
        await using var tx = await db.Database.BeginTransactionAsync(ct);
        var batch = await LoadPreviewedAsync(batchId, ct);
        var meta = JsonSerializer.Deserialize<ImportMeta>(batch.MappingJson, Json)!;
        await ValidateAsync(batch, meta, updateExisting, ct); // re-check against current database state

        var skus = batch.Rows.Where(r => r.Action == ImportRowAction.Update).Select(r => r.Sku!).ToList();
        var existing = await db.Products.Where(p => skus.Contains(p.Sku)).ToDictionaryAsync(p => p.Sku, StringComparer.OrdinalIgnoreCase, ct);

        int created = 0, updated = 0;
        var stockChanges = new List<(Product Product, int Change)>();
        var now = DateTime.UtcNow;

        foreach (var row in batch.Rows.OrderBy(r => r.RowNumber))
        {
            if (row.Action is ImportRowAction.Error or ImportRowAction.Skip) continue;
            var pp = JsonSerializer.Deserialize<ParsedProduct>(row.ParsedJson!, Json)!;

            if (row.Action == ImportRowAction.Create)
            {
                var p = new Product
                {
                    Sku = pp.Sku, Name = pp.Name, Category = pp.Category, Purity = pp.Purity, WeightGrams = pp.WeightGrams,
                    WagePercent = pp.WagePercent, StoneValue = pp.StoneValue, TrackingMode = pp.TrackingMode,
                    StockQuantity = 0, Notes = pp.Notes, CreatedAt = now, UpdatedAt = now,
                };
                db.Products.Add(p);
                if (pp.Stock > 0) stockChanges.Add((p, pp.Stock));
                created++;
            }
            else
            {
                var p = existing[pp.Sku];
                p.Name = pp.Name; p.Category = pp.Category; p.Purity = pp.Purity; p.WeightGrams = pp.WeightGrams;
                p.WagePercent = pp.WagePercent; p.StoneValue = pp.StoneValue; p.Notes = pp.Notes; p.UpdatedAt = now;
                p.Status = ProductStatus.Active;
                var diff = pp.Stock - p.StockQuantity;
                if (pp.TrackingMode != p.TrackingMode)
                {
                    // Switching to Unique with stock > 1 is rejected in validation.
                    p.TrackingMode = pp.TrackingMode;
                }
                if (diff != 0) stockChanges.Add((p, diff));
                updated++;
            }
        }

        batch.Status = ImportStatus.Committed;
        batch.CommittedAt = now;
        batch.CreatedCount = created;
        batch.UpdatedCount = updated;
        batch.SkippedCount = batch.Rows.Count(r => r.Action == ImportRowAction.Skip);
        await db.SaveChangesAsync(ct); // inserts new products (assigns ids) and field updates

        foreach (var (p, change) in stockChanges)
            await Inventory.MoveAsync(db, p.Id, change, MovementType.Import, $"ورود از اکسل #{batch.Id}", actor, importBatchId: batch.Id, ct: ct);

        Audit.Log(db, actor, "import.commit", "ImportBatch", batch.Id,
            $"{batch.FileName}: {created} جدید، {updated} به‌روزرسانی، {batch.SkippedCount} رد شده، {batch.ErrorRows} خطا");
        await db.SaveChangesAsync(ct);
        await tx.CommitAsync(ct);
        return batch;
    }

    public async Task DiscardAsync(int batchId, Actor actor, CancellationToken ct)
    {
        var batch = await LoadPreviewedAsync(batchId, ct);
        batch.Status = ImportStatus.Discarded;
        Audit.Log(db, actor, "import.discard", "ImportBatch", batch.Id, batch.FileName);
        await db.SaveChangesAsync(ct);
    }

    // ---------- Template ----------

    public static byte[] BuildTemplate(bool withSampleRows)
    {
        using var wb = new XLWorkbook();
        var ws = wb.Worksheets.Add("کالاها");
        ws.RightToLeft = true;
        var fields = Enum.GetValues<ImportField>();
        for (var i = 0; i < fields.Length; i++)
        {
            var c = ws.Cell(1, i + 1);
            c.Value = FieldLabels[fields[i]];
            c.Style.Font.Bold = true;
            c.Style.Fill.BackgroundColor = XLColor.FromHtml("#F3E3B5");
        }
        if (withSampleRows)
        {
            var r = 2;
            foreach (var s in SampleData.Products)
            {
                ws.Cell(r, 1).Value = s.Sku; ws.Cell(r, 2).Value = s.Name; ws.Cell(r, 3).Value = s.Category;
                ws.Cell(r, 4).Value = (double)s.Purity; ws.Cell(r, 5).Value = (double)s.WeightGrams; ws.Cell(r, 6).Value = (double)s.WagePercent;
                ws.Cell(r, 7).Value = (double)s.StoneValue; ws.Cell(r, 8).Value = s.TrackingMode == TrackingMode.Unique ? "تکی" : "تعدادی";
                ws.Cell(r, 9).Value = (double)s.Stock; ws.Cell(r, 10).Value = s.Notes ?? "";
                r++;
            }
        }
        ws.Columns().AdjustToContents();
        using var ms = new MemoryStream();
        wb.SaveAs(ms);
        return ms.ToArray();
    }

    // ---------- Internals ----------

    private async Task<ImportBatch> LoadPreviewedAsync(int batchId, CancellationToken ct)
    {
        var batch = await db.ImportBatches.Include(b => b.Rows).SingleOrDefaultAsync(b => b.Id == batchId, ct)
                    ?? throw new AppException("ورود اطلاعات پیدا نشد.", 404);
        if (batch.Status != ImportStatus.Previewed) throw new AppException("این فایل قبلاً ثبت یا لغو شده است.", 409);
        return batch;
    }

    private static (List<string> Headers, List<(int, List<string>)> Rows) ReadSheet(IXLWorksheet ws)
    {
        var headerRow = ws.FirstRowUsed()?.RowNumber() ?? throw new AppException("برگه اول فایل خالی است.");
        var lastRow = ws.LastRowUsed()!.RowNumber();
        var lastCol = ws.LastColumnUsed()!.ColumnNumber();
        if (lastRow - headerRow > MaxRows) throw new AppException($"حداکثر {MaxRows} ردیف در هر فایل مجاز است.");

        var headers = Enumerable.Range(1, lastCol).Select(c => CellText(ws.Cell(headerRow, c))).ToList();
        var rows = new List<(int, List<string>)>();
        for (var r = headerRow + 1; r <= lastRow; r++)
        {
            var cells = Enumerable.Range(1, lastCol).Select(c => CellText(ws.Cell(r, c))).ToList();
            if (cells.All(string.IsNullOrWhiteSpace)) continue;
            rows.Add((r, cells));
        }
        return (headers, rows);
    }

    private static string CellText(IXLCell cell)
    {
        var v = cell.Value;
        if (v.IsBlank) return "";
        if (v.IsNumber) return v.GetNumber().ToString("R", CultureInfo.InvariantCulture);
        if (v.IsText) return v.GetText().Trim();
        return cell.GetFormattedString().Trim();
    }

    private static string NormHeader(string s) =>
        new string(s.Trim().ToLowerInvariant().Replace('ي', 'ی').Replace('ك', 'ک')
            .Where(ch => !char.IsWhiteSpace(ch) && ch != '‌' && ch != '_' && ch != '-').ToArray());

    internal static Dictionary<ImportField, int> AutoMap(List<string> headers)
    {
        var map = new Dictionary<ImportField, int>();
        var norm = headers.Select(NormHeader).ToList();
        foreach (var (field, aliases) in Aliases)
        {
            var normAliases = aliases.Select(NormHeader).ToList();
            var idx = norm.FindIndex(h => normAliases.Contains(h));
            if (idx >= 0 && !map.ContainsValue(idx)) map[field] = idx;
        }
        return map;
    }

    private async Task ValidateAsync(ImportBatch batch, ImportMeta meta, bool updateExisting, CancellationToken ct)
    {
        var parsed = batch.Rows.Select(r => (Row: r, Result: ParseRow(JsonSerializer.Deserialize<List<string>>(r.RawJson, Json)!, meta.Mapping))).ToList();

        var skus = parsed.Where(p => p.Result.Product != null).Select(p => p.Result.Product!.Sku).Distinct().ToList();
        var existing = await db.Products.AsNoTracking().Where(p => skus.Contains(p.Sku))
            .Select(p => new { p.Sku, p.TrackingMode, p.StockQuantity })
            .ToDictionaryAsync(p => p.Sku, StringComparer.OrdinalIgnoreCase, ct);

        var seen = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        foreach (var (row, result) in parsed)
        {
            var errors = result.Errors;
            var pp = result.Product;
            row.Sku = pp?.Sku ?? result.RawSku;

            if (pp != null && !seen.Add(pp.Sku)) errors.Add("کد کالا در همین فایل تکراری است.");
            if (pp != null && errors.Count == 0 && existing.TryGetValue(pp.Sku, out var ex) && updateExisting
                && pp.TrackingMode == TrackingMode.Unique && ex.TrackingMode == TrackingMode.Quantity && pp.Stock > 1)
                errors.Add("کالای تکی نمی‌تواند بیش از ۱ موجودی داشته باشد.");

            if (errors.Count > 0)
            {
                row.Action = ImportRowAction.Error;
                row.Errors = string.Join(" | ", errors);
                row.ParsedJson = null;
            }
            else
            {
                row.Errors = null;
                row.ParsedJson = JsonSerializer.Serialize(pp, Json);
                row.Action = existing.ContainsKey(pp!.Sku)
                    ? (updateExisting ? ImportRowAction.Update : ImportRowAction.Skip)
                    : ImportRowAction.Create;
            }
        }

        batch.TotalRows = batch.Rows.Count;
        batch.ErrorRows = batch.Rows.Count(r => r.Action == ImportRowAction.Error);
        batch.CreatedCount = batch.Rows.Count(r => r.Action == ImportRowAction.Create);
        batch.UpdatedCount = batch.Rows.Count(r => r.Action == ImportRowAction.Update);
        batch.SkippedCount = batch.Rows.Count(r => r.Action == ImportRowAction.Skip);
    }

    internal record ParseResult(ParsedProduct? Product, List<string> Errors, string? RawSku);

    internal static ParseResult ParseRow(List<string> cells, Dictionary<ImportField, int> map)
    {
        var errors = new List<string>();
        string Get(ImportField f) => map.TryGetValue(f, out var i) && i < cells.Count ? cells[i].Trim() : "";

        foreach (var required in new[] { ImportField.Sku, ImportField.Name, ImportField.Weight })
            if (!map.ContainsKey(required)) errors.Add($"ستون «{FieldLabels[required]}» انتخاب نشده است.");
        if (errors.Count > 0) return new ParseResult(null, errors, null);

        var sku = NumberText.LatinDigits(Get(ImportField.Sku)).Trim();
        if (string.IsNullOrWhiteSpace(sku)) errors.Add("کد کالا خالی است.");
        else if (sku.Length > 64) errors.Add("کد کالا بیش از ۶۴ کاراکتر است.");

        var name = Get(ImportField.Name);
        if (string.IsNullOrWhiteSpace(name)) errors.Add("نام کالا خالی است.");
        else if (name.Length > 200) errors.Add("نام کالا خیلی طولانی است.");

        var category = Get(ImportField.Category);
        if (category.Length > 100) errors.Add("دسته‌بندی خیلی طولانی است.");

        var purity = 750;
        var purityText = Get(ImportField.Purity);
        if (purityText != "")
        {
            if (!NumberText.TryDecimal(purityText, out var pd)) errors.Add($"عیار «{purityText}» عدد نیست.");
            else
            {
                // Accept karat (18, 21, 24) or thousandths (750, 875, 999)
                purity = pd <= 24 ? (int)Math.Round(pd / 24m * 1000m) : (int)Math.Round(pd);
                if (purity is < 1 or > 1000) errors.Add($"عیار «{purityText}» نامعتبر است.");
            }
        }

        decimal weight = 0;
        var weightText = Get(ImportField.Weight);
        if (weightText == "") errors.Add("وزن خالی است.");
        else if (!NumberText.TryDecimal(weightText, out weight)) errors.Add($"وزن «{weightText}» عدد نیست.");
        else if (weight <= 0 || weight > 100000) errors.Add("وزن باید بیشتر از صفر باشد.");
        weight = Math.Round(weight, 3);

        decimal wage = 0;
        var wageText = Get(ImportField.WagePercent).Replace("%", "").Replace("٪", "");
        if (wageText != "" && !NumberText.TryDecimal(wageText, out wage)) errors.Add($"اجرت «{wageText}» عدد نیست.");
        else if (wage is < 0 or > 100) errors.Add("درصد اجرت باید بین ۰ تا ۱۰۰ باشد.");

        decimal stone = 0;
        var stoneText = Get(ImportField.StoneValue);
        if (stoneText != "" && !NumberText.TryDecimal(stoneText, out stone)) errors.Add($"ارزش سنگ «{stoneText}» عدد نیست.");
        else if (stone < 0) errors.Add("ارزش سنگ نمی‌تواند منفی باشد.");

        var trackingText = NormHeader(Get(ImportField.Tracking));
        TrackingMode tracking;
        if (trackingText is "" or "تکی" or "unique" or "single") tracking = TrackingMode.Unique;
        else if (trackingText is "تعدادی" or "quantity" or "qty" or "چندتایی") tracking = TrackingMode.Quantity;
        else { tracking = TrackingMode.Unique; errors.Add($"نوع «{Get(ImportField.Tracking)}» باید «تکی» یا «تعدادی» باشد."); }

        var stock = tracking == TrackingMode.Unique ? 1 : 0;
        var stockText = Get(ImportField.Stock);
        if (stockText != "" && !NumberText.TryInt(stockText, out stock)) errors.Add($"موجودی «{stockText}» عدد صحیح نیست.");
        else if (stock < 0) errors.Add("موجودی نمی‌تواند منفی باشد.");
        else if (tracking == TrackingMode.Unique && stock > 1) errors.Add("کالای تکی نمی‌تواند بیش از ۱ موجودی داشته باشد.");

        var notes = Get(ImportField.Notes);
        if (notes.Length > 1000) notes = notes[..1000];

        var product = errors.Count == 0
            ? new ParsedProduct(sku, name, category, purity, weight, wage, stone, tracking, stock, notes == "" ? null : notes)
            : null;
        return new ParseResult(product, errors, string.IsNullOrWhiteSpace(sku) ? null : sku);
    }
}
