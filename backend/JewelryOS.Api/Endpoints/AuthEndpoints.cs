using System.Security.Claims;
using JewelryOS.Api.Data;
using JewelryOS.Api.Domain;
using JewelryOS.Api.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace JewelryOS.Api.Endpoints;

public record LoginRequest(string Username, string Password);
public record ChangePasswordRequest(string CurrentPassword, string NewPassword);
public record CreateUserRequest(string Username, string DisplayName, string Password, Role Role);
public record UpdateUserRequest(string DisplayName, Role Role, bool IsActive);
public record ResetPasswordRequest(string NewPassword);

public static class AuthEndpoints
{
    private static readonly PasswordHasher<User> Hasher = new();

    public static object Me(User u) => new { u.Id, u.Username, u.DisplayName, role = u.Role.ToString(), u.MustChangePassword };

    public static void Map(WebApplication app)
    {
        var auth = app.MapGroup("/api/auth");

        auth.MapPost("/login", async (LoginRequest req, AppDb db, HttpContext http) =>
        {
            var username = (req.Username ?? "").Trim().ToLowerInvariant();
            var user = await db.Users.SingleOrDefaultAsync(u => u.Username == username);
            if (user == null || !user.IsActive ||
                Hasher.VerifyHashedPassword(user, user.PasswordHash, req.Password ?? "") == PasswordVerificationResult.Failed)
            {
                Audit.Log(db, null, "auth.login_failed", "User", user?.Id, $"نام کاربری: {username}");
                await db.SaveChangesAsync();
                throw new AppException("نام کاربری یا رمز عبور اشتباه است.", 401);
            }

            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new(ClaimTypes.Name, user.Username),
                new(ClaimTypes.GivenName, user.DisplayName),
                new(ClaimTypes.Role, user.Role.ToString()),
            };
            await http.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme)));
            Audit.Log(db, new Actor(user.Id, user.DisplayName, user.Role), "auth.login", "User", user.Id, null);
            await db.SaveChangesAsync();
            return Results.Ok(Me(user));
        }).AllowAnonymous().RequireRateLimiting("login");

        auth.MapPost("/logout", async (HttpContext http) =>
        {
            await http.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Results.NoContent();
        }).AllowAnonymous();

        auth.MapGet("/me", async (ClaimsPrincipal p, AppDb db) =>
        {
            var user = await db.Users.FindAsync(p.Actor().Id);
            return user is { IsActive: true } ? Results.Ok(Me(user)) : Results.Unauthorized();
        }).RequireAuthorization();

        auth.MapPost("/change-password", async (ChangePasswordRequest req, ClaimsPrincipal p, AppDb db) =>
        {
            var user = await db.Users.FindAsync(p.Actor().Id) ?? throw new AppException("کاربر پیدا نشد.", 404);
            if (Hasher.VerifyHashedPassword(user, user.PasswordHash, req.CurrentPassword ?? "") == PasswordVerificationResult.Failed)
                throw new AppException("رمز فعلی اشتباه است.");
            ValidatePassword(req.NewPassword);
            user.PasswordHash = Hasher.HashPassword(user, req.NewPassword);
            user.MustChangePassword = false;
            Audit.Log(db, p.Actor(), "user.change_password", "User", user.Id, null);
            await db.SaveChangesAsync();
            return Results.Ok(Me(user));
        }).RequireAuthorization();

        // ----- User management (owner only) -----
        var users = app.MapGroup("/api/users").RequireAuthorization("Owner");

        users.MapGet("/", async (AppDb db) =>
            await db.Users.OrderBy(u => u.Id)
                .Select(u => new { u.Id, u.Username, u.DisplayName, role = u.Role.ToString(), u.IsActive, u.CreatedAt })
                .ToListAsync());

        users.MapPost("/", async (CreateUserRequest req, ClaimsPrincipal p, AppDb db) =>
        {
            var username = (req.Username ?? "").Trim().ToLowerInvariant();
            if (username.Length is < 3 or > 64 || !username.All(c => char.IsAsciiLetterOrDigit(c) || c is '.' or '_' or '-'))
                throw new AppException("نام کاربری باید ۳ تا ۶۴ حرف انگلیسی یا عدد باشد.");
            if (string.IsNullOrWhiteSpace(req.DisplayName)) throw new AppException("نام نمایشی را وارد کنید.");
            ValidatePassword(req.Password);
            if (await db.Users.AnyAsync(u => u.Username == username)) throw new AppException("این نام کاربری قبلاً ثبت شده است.", 409);

            var user = new User { Username = username, DisplayName = req.DisplayName.Trim(), Role = req.Role, MustChangePassword = true };
            user.PasswordHash = Hasher.HashPassword(user, req.Password);
            db.Users.Add(user);
            Audit.Log(db, p.Actor(), "user.create", "User", username, $"{user.DisplayName} ({user.Role})");
            await db.SaveChangesAsync();
            return Results.Ok(new { user.Id });
        });

        users.MapPut("/{id:int}", async (int id, UpdateUserRequest req, ClaimsPrincipal p, AppDb db) =>
        {
            var user = await db.Users.FindAsync(id) ?? throw new AppException("کاربر پیدا نشد.", 404);
            var actor = p.Actor();
            if (user.Id == actor.Id && (!req.IsActive || req.Role != Role.Owner))
                throw new AppException("نمی‌توانید دسترسی مدیر را از حساب خودتان بگیرید.");
            if (string.IsNullOrWhiteSpace(req.DisplayName)) throw new AppException("نام نمایشی را وارد کنید.");
            var before = $"{user.DisplayName}/{user.Role}/{(user.IsActive ? "فعال" : "غیرفعال")}";
            user.DisplayName = req.DisplayName.Trim(); user.Role = req.Role; user.IsActive = req.IsActive;
            Audit.Log(db, actor, "user.update", "User", user.Id, $"{before} ← {user.DisplayName}/{user.Role}/{(user.IsActive ? "فعال" : "غیرفعال")}");
            await db.SaveChangesAsync();
            return Results.NoContent();
        });

        users.MapPost("/{id:int}/reset-password", async (int id, ResetPasswordRequest req, ClaimsPrincipal p, AppDb db) =>
        {
            var user = await db.Users.FindAsync(id) ?? throw new AppException("کاربر پیدا نشد.", 404);
            ValidatePassword(req.NewPassword);
            user.PasswordHash = Hasher.HashPassword(user, req.NewPassword);
            user.MustChangePassword = true;
            Audit.Log(db, p.Actor(), "user.reset_password", "User", user.Id, user.Username);
            await db.SaveChangesAsync();
            return Results.NoContent();
        });
    }

    private static void ValidatePassword(string? pw)
    {
        if (string.IsNullOrEmpty(pw) || pw.Length < 8) throw new AppException("رمز عبور باید حداقل ۸ کاراکتر باشد.");
    }
}
