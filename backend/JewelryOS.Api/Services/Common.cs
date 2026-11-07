using System.Globalization;
using System.Security.Claims;
using System.Text;
using JewelryOS.Api.Data;
using JewelryOS.Api.Domain;

namespace JewelryOS.Api.Services;

/// <summary>Business-rule failure that should be shown to the user (HTTP 400 / 409).</summary>
public class AppException(string message, int status = 400) : Exception(message)
{
    public int Status { get; } = status;
}

public record Actor(int Id, string Name, Role Role);

public static class ActorExtensions
{
    public static Actor Actor(this ClaimsPrincipal p) => new(
        int.Parse(p.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0"),
        p.FindFirstValue(ClaimTypes.GivenName) ?? p.Identity?.Name ?? "",
        Enum.TryParse<Role>(p.FindFirstValue(ClaimTypes.Role), out var r) ? r : Role.Seller);
}

public static class Audit
{
    /// <summary>Adds an audit event to the context; persisted by the caller's SaveChanges.</summary>
    public static void Log(AppDb db, Actor? actor, string action, string resourceType, object? resourceId, string? summary)
    {
        db.AuditEvents.Add(new AuditEvent
        {
            ActorUserId = actor?.Id,
            ActorName = actor?.Name ?? "سیستم",
            Action = action,
            ResourceType = resourceType,
            ResourceId = resourceId?.ToString(),
            Summary = summary is { Length: > 1000 } ? summary[..1000] : summary,
        });
    }
}

/// <summary>Parses numbers typed or pasted in Persian/Arabic/Latin digits with mixed separators.</summary>
public static class NumberText
{
    public static string Normalize(string? s)
    {
        if (string.IsNullOrWhiteSpace(s)) return "";
        var sb = new StringBuilder(s.Length);
        foreach (var ch in s.Trim())
        {
            if (ch is >= '۰' and <= '۹') sb.Append((char)('0' + (ch - '۰')));
            else if (ch is >= '٠' and <= '٩') sb.Append((char)('0' + (ch - '٠')));
            else if (ch is '٫' or '/') sb.Append('.');          // Persian decimal separator ("/" is often typed as one)
            else if (ch is ',' or '،' or '٬' or ' ' or '‌' or ' ') continue; // thousands separators / spaces
            else if (ch is '−' or '–') sb.Append('-');
            else sb.Append(ch);
        }
        return sb.ToString();
    }

    /// <summary>Converts only Persian/Arabic digits to Latin, keeping every other character (for codes/SKUs).</summary>
    public static string LatinDigits(string? s)
    {
        if (string.IsNullOrEmpty(s)) return "";
        var sb = new StringBuilder(s.Length);
        foreach (var ch in s)
            sb.Append(ch is >= '۰' and <= '۹' ? (char)('0' + (ch - '۰')) : ch is >= '٠' and <= '٩' ? (char)('0' + (ch - '٠')) : ch);
        return sb.ToString();
    }

    public static bool TryDecimal(string? s, out decimal value) =>
        decimal.TryParse(Normalize(s), NumberStyles.Number, CultureInfo.InvariantCulture, out value);

    public static bool TryInt(string? s, out int value)
    {
        value = 0;
        if (!TryDecimal(s, out var d) || d != Math.Truncate(d) || d > int.MaxValue || d < int.MinValue) return false;
        value = (int)d;
        return true;
    }
}

/// <summary>Persian formatting used by the PDF invoice.</summary>
public static class FaFormat
{
    private static readonly PersianCalendar Pc = new();
    private static readonly TimeZoneInfo Tehran = FindTehran();

    public static string Digits(string s)
    {
        var sb = new StringBuilder(s.Length);
        foreach (var ch in s) sb.Append(ch is >= '0' and <= '9' ? (char)('۰' + (ch - '0')) : ch == '.' ? '٫' : ch);
        return sb.ToString();
    }

    public static string Money(decimal v) => Digits(v.ToString("#,0", CultureInfo.InvariantCulture)).Replace(',', '٬');
    public static string Num(decimal v, int decimals = 3) =>
        Digits(v.ToString("#,0." + new string('#', decimals), CultureInfo.InvariantCulture)).Replace(',', '٬');

    public static string Date(DateTime utc)
    {
        var local = TimeZoneInfo.ConvertTimeFromUtc(AsUtc(utc), Tehran);
        return Digits($"{Pc.GetYear(local):0000}/{Pc.GetMonth(local):00}/{Pc.GetDayOfMonth(local):00} - {local:HH:mm}");
    }

    private static DateTime AsUtc(DateTime d) => d.Kind == DateTimeKind.Utc ? d : DateTime.SpecifyKind(d, DateTimeKind.Utc);

    private static TimeZoneInfo FindTehran()
    {
        foreach (var id in new[] { "Asia/Tehran", "Iran Standard Time" })
        {
            try { return TimeZoneInfo.FindSystemTimeZoneById(id); } catch { /* try next */ }
        }
        return TimeZoneInfo.CreateCustomTimeZone("Tehran", TimeSpan.FromHours(3.5), "Tehran", "Tehran");
    }
}
