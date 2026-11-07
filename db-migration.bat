@echo off
REM Creates an EF Core migration after you change the data model (Domain\Entities.cs or Data\AppDb.cs).
REM Usage:  db-migration.bat MigrationName      e.g.  db-migration.bat AddProductImage
REM The app applies new migrations automatically on next start and backs up the database first.
if "%~1"=="" (
  echo Usage: db-migration.bat MigrationName
  pause
  exit /b 1
)
cd /d "%~dp0"
set DOTNET_ROLL_FORWARD=Major
dotnet tool restore || goto fail
dotnet ef migrations add %1 --project backend\JewelryOS.Api --output-dir Data\Migrations || goto fail
echo.
echo Done. New files are in backend\JewelryOS.Api\Data\Migrations
pause
exit /b 0
:fail
echo.
echo FAILED - copy the error above and send it.
pause
exit /b 1
