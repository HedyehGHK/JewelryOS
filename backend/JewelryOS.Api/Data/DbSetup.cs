using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace JewelryOS.Api.Data;

/// <summary>
/// Brings the SQLite database up to date on every start:
///  1. If no migrations exist yet in the project, falls back to EnsureCreated (first prototype builds).
///  2. A database created earlier by EnsureCreated is "baselined" onto the first migration (same schema).
///  3. Before applying pending migrations to an existing database, a copy is saved to a "backups" folder next to the database file.
/// </summary>
public static class DbSetup
{
    public static async Task MigrateAsync(AppDb db, ILogger logger)
    {
        var migrations = db.Database.GetMigrations().ToList();
        if (migrations.Count == 0)
        {
            await db.Database.EnsureCreatedAsync();
            return;
        }

        var dbFile = new SqliteConnectionStringBuilder(db.Database.GetConnectionString()).DataSource;
        var exists = File.Exists(dbFile) && new FileInfo(dbFile).Length > 0;

        if (exists && await TableExistsAsync(db, "Products") && !await TableExistsAsync(db, "__EFMigrationsHistory"))
        {
            // Created by EnsureCreated before migrations were added: mark the first migration as already applied.
            var version = typeof(DbContext).Assembly.GetName().Version?.ToString(3) ?? "8.0.0";
            await db.Database.ExecuteSqlRawAsync(
                "CREATE TABLE \"__EFMigrationsHistory\" (\"MigrationId\" TEXT NOT NULL CONSTRAINT \"PK___EFMigrationsHistory\" PRIMARY KEY, \"ProductVersion\" TEXT NOT NULL);");
            await db.Database.ExecuteSqlRawAsync(
                "INSERT INTO \"__EFMigrationsHistory\" (\"MigrationId\", \"ProductVersion\") VALUES ({0}, {1});", migrations[0], version);
            logger.LogWarning("Existing database baselined onto migration {Migration}.", migrations[0]);
        }

        var pending = (await db.Database.GetPendingMigrationsAsync()).ToList();
        if (pending.Count == 0) return;

        if (exists && await TableExistsAsync(db, "Products"))
        {
            var backupDir = Path.Combine(Path.GetDirectoryName(dbFile)!, "backups");
            Directory.CreateDirectory(backupDir);
            var backup = Path.Combine(backupDir, $"before-update-{DateTime.Now:yyyyMMdd-HHmmss}.db");
            SqliteConnection.ClearAllPools();
            File.Copy(dbFile, backup, overwrite: false);
            logger.LogWarning("Backed up database to {Backup} before applying {Count} migration(s).", backup, pending.Count);
        }

        await db.Database.MigrateAsync();
        logger.LogInformation("Applied migrations: {Migrations}", string.Join(", ", pending));
    }

    private static async Task<bool> TableExistsAsync(AppDb db, string table)
    {
        var conn = db.Database.GetDbConnection();
        var wasOpen = conn.State == System.Data.ConnectionState.Open;
        if (!wasOpen) await conn.OpenAsync();
        try
        {
            await using var cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT COUNT(*) FROM sqlite_master WHERE type = 'table' AND name = $name";
            var p = cmd.CreateParameter(); p.ParameterName = "$name"; p.Value = table; cmd.Parameters.Add(p);
            return Convert.ToInt64(await cmd.ExecuteScalarAsync()) > 0;
        }
        finally
        {
            if (!wasOpen) await conn.CloseAsync();
        }
    }
}

/// <summary>Used only by "dotnet ef migrations add" at design time.</summary>
public class AppDbDesignFactory : IDesignTimeDbContextFactory<AppDb>
{
    public AppDb CreateDbContext(string[] args) =>
        new(new DbContextOptionsBuilder<AppDb>().UseSqlite("Data Source=design-time.db").Options);
}
