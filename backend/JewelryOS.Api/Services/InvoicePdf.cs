using JewelryOS.Api.Domain;
using QuestPDF.Drawing;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace JewelryOS.Api.Services;

/// <summary>Persian, right-to-left A5 invoice rendered on the server with QuestPDF.</summary>
public static class InvoicePdf
{
    private const string Font = "Vazirmatn";
    private static bool _initialised;
    private static readonly object Gate = new();

    public static void Initialise(string contentRoot)
    {
        lock (Gate)
        {
            if (_initialised) return;
            // QuestPDF Community licence is free for businesses under USD 1M annual revenue. See questpdf.com/license
            QuestPDF.Settings.License = LicenseType.Community;
            var dir = Path.Combine(AppContext.BaseDirectory, "Fonts");
            if (!Directory.Exists(dir)) dir = Path.Combine(contentRoot, "Fonts");
            foreach (var file in new[] { "Vazirmatn-Regular.ttf", "Vazirmatn-Bold.ttf" })
            {
                using var fs = File.OpenRead(Path.Combine(dir, file));
                FontManager.RegisterFont(fs);
            }
            _initialised = true;
        }
    }

    public static byte[] Render(Invoice inv, StoreSettings store)
    {
        var cur = store.CurrencyLabel;
        var closed = inv.Status != InvoiceStatus.Issued;

        return Document.Create(doc => doc.Page(page =>
        {
            page.Size(PageSizes.A5);
            page.Margin(18);
            page.ContentFromRightToLeft();
            page.DefaultTextStyle(t => t.FontFamily(Font).FontSize(8.5f));

            page.Header().Column(col =>
            {
                col.Item().Row(row =>
                {
                    row.RelativeItem().Column(c =>
                    {
                        c.Item().Text(store.StoreName).FontSize(14).Bold();
                        if (!string.IsNullOrWhiteSpace(store.Address)) c.Item().Text(store.Address).FontColor(Colors.Grey.Darken2);
                        if (!string.IsNullOrWhiteSpace(store.Phone)) c.Item().Text("تلفن: " + FaFormat.Digits(store.Phone)).FontColor(Colors.Grey.Darken2);
                    });
                    row.ConstantItem(150).AlignLeft().Column(c =>
                    {
                        c.Item().AlignLeft().Text("فاکتور فروش").FontSize(12).Bold();
                        c.Item().AlignLeft().Text("شماره: " + FaFormat.Digits(inv.Number.ToString()));
                        c.Item().AlignLeft().Text("تاریخ: " + FaFormat.Date(inv.CreatedAt));
                    });
                });
                col.Item().PaddingVertical(6).LineHorizontal(0.8f).LineColor(Colors.Grey.Lighten1);
                col.Item().Row(row =>
                {
                    row.RelativeItem().Text("خریدار: " + (inv.CustomerName ?? "—") +
                        (inv.CustomerPhone is { } ph ? "   تلفن: " + FaFormat.Digits(ph) : ""));
                    row.RelativeItem().AlignLeft().Text($"نرخ روز طلای ۱۸ عیار (هر گرم): {FaFormat.Money(inv.PricePerGram18k)} {cur}");
                });
                if (closed)
                {
                    col.Item().PaddingTop(6).Background(Colors.Red.Lighten4).Padding(4).AlignCenter()
                        .Text((inv.Status == InvoiceStatus.Voided ? "این فاکتور باطل شده است" : "این فاکتور مرجوع شده است")
                              + (inv.CloseReason is { } r ? " — " + r : "")).Bold().FontColor(Colors.Red.Darken3);
                }
            });

            page.Content().PaddingTop(8).Column(col =>
            {
                col.Item().Table(t =>
                {
                    t.ColumnsDefinition(c =>
                    {
                        c.ConstantColumn(18);   // #
                        c.RelativeColumn(3.2f); // name
                        c.RelativeColumn(1.1f); // purity
                        c.RelativeColumn(1.2f); // weight
                        c.RelativeColumn(0.7f); // qty
                        c.RelativeColumn(1.9f); // gold
                        c.RelativeColumn(1.7f); // wage
                        c.RelativeColumn(1.5f); // profit
                        c.RelativeColumn(1.5f); // tax
                        c.RelativeColumn(2f);   // total
                    });
                    t.Header(h =>
                    {
                        foreach (var title in new[] { "ردیف", "شرح کالا", "عیار", "وزن (گرم)", "تعداد", "ارزش طلا", "اجرت", "سود", "مالیات", "جمع" })
                            h.Cell().Element(HeaderCell).Text(title).Bold();
                    });
                    var i = 1;
                    foreach (var l in inv.Lines)
                    {
                        t.Cell().Element(BodyCell).Text(FaFormat.Digits(i++.ToString()));
                        t.Cell().Element(BodyCell).Column(c =>
                        {
                            c.Item().Text(l.ProductName);
                            c.Item().Text("کد: " + FaFormat.Digits(l.Sku) + (l.StoneValue > 0 ? $" | سنگ: {FaFormat.Money(l.StoneValue)}" : ""))
                                .FontSize(6.5f).FontColor(Colors.Grey.Darken1);
                        });
                        t.Cell().Element(BodyCell).Text(FaFormat.Digits(l.Purity.ToString()));
                        t.Cell().Element(BodyCell).Text(FaFormat.Num(l.WeightGrams));
                        t.Cell().Element(BodyCell).Text(FaFormat.Digits(l.Quantity.ToString()));
                        t.Cell().Element(BodyCell).Text(FaFormat.Money(l.GoldValue));
                        t.Cell().Element(BodyCell).Column(c =>
                        {
                            c.Item().Text(FaFormat.Money(l.WageAmount));
                            c.Item().Text("(" + FaFormat.Num(l.WagePercent, 2) + "٪)").FontSize(6.5f).FontColor(Colors.Grey.Darken1);
                        });
                        t.Cell().Element(BodyCell).Text(FaFormat.Money(l.ProfitAmount));
                        t.Cell().Element(BodyCell).Text(FaFormat.Money(l.TaxAmount));
                        t.Cell().Element(BodyCell).Text(FaFormat.Money(l.LineTotal)).Bold();
                    }
                });

                col.Item().PaddingTop(10).AlignLeft().Width(220).Column(sum =>
                {
                    void Line(string label, decimal value, bool bold = false)
                    {
                        sum.Item().BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten2).PaddingVertical(2).Row(r =>
                        {
                            var lt = r.RelativeItem().Text(label);
                            var vt = r.RelativeItem().AlignLeft().Text($"{FaFormat.Money(value)} {cur}");
                            if (bold) { lt.Bold(); vt.Bold(); }
                        });
                    }
                    Line("ارزش طلا", inv.GoldTotal);
                    Line("اجرت ساخت", inv.WageTotal);
                    Line($"سود فروشنده ({FaFormat.Num(inv.ProfitPercent, 2)}٪)", inv.ProfitTotal);
                    if (inv.StoneTotal > 0) Line("سنگ و اضافات", inv.StoneTotal);
                    Line($"مالیات بر ارزش افزوده ({FaFormat.Num(inv.TaxPercent, 2)}٪)", inv.TaxTotal);
                    if (inv.RoundingAdjustment != 0) Line("گرد کردن", inv.RoundingAdjustment);
                    sum.Item().PaddingTop(3).Background(Colors.Amber.Lighten4).Padding(4).Row(r =>
                    {
                        r.RelativeItem().Text("مبلغ قابل پرداخت").Bold().FontSize(10);
                        r.RelativeItem().AlignLeft().Text($"{FaFormat.Money(inv.GrandTotal)} {cur}").Bold().FontSize(10);
                    });
                });

                if (!string.IsNullOrWhiteSpace(inv.Notes))
                    col.Item().PaddingTop(8).Text("توضیحات: " + inv.Notes);

                col.Item().PaddingTop(28).Row(r =>
                {
                    r.RelativeItem().AlignCenter().Text("امضای فروشنده: " + inv.SellerName);
                    r.RelativeItem().AlignCenter().Text("امضای خریدار");
                });
            });

            page.Footer().Column(f =>
            {
                if (!string.IsNullOrWhiteSpace(store.InvoiceFooter))
                    f.Item().AlignCenter().Text(store.InvoiceFooter).FontColor(Colors.Grey.Darken2);
                f.Item().AlignCenter().Text(t =>
                {
                    t.DefaultTextStyle(s => s.FontSize(6.5f).FontColor(Colors.Grey.Medium));
                    t.Span("صفحه ");
                    t.CurrentPageNumber();
                });
            });
        })).GeneratePdf();
    }

    private static IContainer HeaderCell(IContainer c) =>
        c.Background(Colors.Amber.Lighten4).Border(0.5f).BorderColor(Colors.Grey.Lighten1).Padding(3).AlignCenter().AlignMiddle();

    private static IContainer BodyCell(IContainer c) =>
        c.Border(0.5f).BorderColor(Colors.Grey.Lighten2).Padding(3).AlignCenter().AlignMiddle();
}
