using System.Text.Json.Serialization;
using System.Threading.RateLimiting;
using JewelryOS.Api.Data;
using JewelryOS.Api.Domain;
using JewelryOS.Api.Endpoints;
using JewelryOS.Api.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
var config = builder.Configuration;

// ---------- Database (SQLite, one file) ----------
var connection = config.GetConnectionString("Default") ?? "Data Source=storage/jewelryos.db"; // not "data/": on Windows that is the same folder as the Data/ source folder
// Resolve a relative database path against the app folder (not the current shell folder).
var csb = new Microsoft.Data.Sqlite.SqliteConnectionStringBuilder(connection);
csb.DataSource = Path.GetFullPath(csb.DataSource, builder.Environment.ContentRootPath);
Directory.CreateDirectory(Path.GetDirectoryName(csb.DataSource)!);
builder.Services.AddDbContext<AppDb>(o => o.UseSqlite(csb.ToString()));

builder.Services.AddScoped<SalesService>();
builder.Services.AddScoped<ImportService>();

// ---------- JSON ----------
builder.Services.ConfigureHttpJsonOptions(o =>
{
    o.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
    o.SerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.Never;
});

// ---------- Auth: HttpOnly cookie, API returns 401/403 instead of redirects ----------
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(o =>
    {
        o.Cookie.Name = "jewelryos.auth";
        o.Cookie.HttpOnly = true;
        o.Cookie.SameSite = SameSiteMode.Strict;
        o.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest; // store LAN may run on plain http
        o.ExpireTimeSpan = TimeSpan.FromHours(12);
        o.SlidingExpiration = true;
        o.Events.OnRedirectToLogin = ctx => { ctx.Response.StatusCode = 401; return Task.CompletedTask; };
        o.Events.OnRedirectToAccessDenied = ctx => { ctx.Response.StatusCode = 403; return Task.CompletedTask; };
        o.Events.OnValidatePrincipal = async ctx =>
        {
            // Deactivated users or changed roles take effect immediately.
            var db = ctx.HttpContext.RequestServices.GetRequiredService<AppDb>();
            var id = int.TryParse(ctx.Principal?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value, out var v) ? v : 0;
            var role = ctx.Principal?.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            var user = await db.Users.AsNoTracking().Where(u => u.Id == id).Select(u => new { u.IsActive, u.Role }).SingleOrDefaultAsync();
            if (user is not { IsActive: true } || user.Role.ToString() != role)
            {
                ctx.RejectPrincipal();
                await ctx.HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            }
        };
    });
builder.Services.AddAuthorizationBuilder()
    .AddPolicy("Owner", p => p.RequireRole(nameof(Role.Owner)));

builder.Services.AddRateLimiter(o =>
{
    o.RejectionStatusCode = 429;
    o.AddPolicy("login", ctx => RateLimitPartition.GetFixedWindowLimiter(
        ctx.Connection.RemoteIpAddress?.ToString() ?? "unknown",
        _ => new FixedWindowRateLimiterOptions { PermitLimit = 10, Window = TimeSpan.FromMinutes(1) }));
});

builder.Services.Configure<Microsoft.AspNetCore.Http.Features.FormOptions>(o => o.MultipartBodyLengthLimit = ImportService.MaxFileBytes + 64 * 1024);

var app = builder.Build();

// ---------- Errors → { message } JSON ----------
app.UseExceptionHandler(b => b.Run(async ctx =>
{
    var ex = ctx.Features.Get<IExceptionHandlerFeature>()?.Error;
    var (status, message) = ex switch
    {
        AppException ae => (ae.Status, ae.Message),
        BadHttpRequestException => (400, "درخواست نامعتبر است."),
        DbUpdateException => (409, "ثبت اطلاعات با خطا مواجه شد؛ ممکن است همزمان تغییر کرده باشد. دوباره تلاش کنید."),
        _ => (500, "خطای غیرمنتظره رخ داد. جزئیات در لاگ سرور ثبت شد."),
    };
    if (status >= 500) app.Logger.LogError(ex, "Unhandled error on {Path}", ctx.Request.Path);
    ctx.Response.StatusCode = status;
    await ctx.Response.WriteAsJsonAsync(new { message });
}));

// ---------- CSRF guard: state-changing API calls must carry a custom header (browsers can't add it cross-site) ----------
app.Use(async (ctx, next) =>
{
    if (ctx.Request.Path.StartsWithSegments("/api") && !HttpMethods.IsGet(ctx.Request.Method) && !HttpMethods.IsHead(ctx.Request.Method)
        && ctx.Request.Headers["X-Requested-With"] != "JewelryOS")
    {
        ctx.Response.StatusCode = 400;
        await ctx.Response.WriteAsJsonAsync(new { message = "درخواست نامعتبر (هدر امنیتی ارسال نشده)." });
        return;
    }
    await next();
});

app.UseDefaultFiles();
app.UseStaticFiles();
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();

AuthEndpoints.Map(app);
CatalogEndpoints.Map(app);
SalesEndpoints.Map(app);
ReportEndpoints.Map(app, config);

// Angular client-side routes
app.MapFallbackToFile("index.html");

// ---------- Database update (migrations, with automatic backup) + first-run seed ----------
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDb>();
    await DbSetup.MigrateAsync(db, app.Logger);
    await Seed.RunAsync(db, config, app.Logger);
}
InvoicePdf.Initialise(app.Environment.ContentRootPath);

app.Run();

