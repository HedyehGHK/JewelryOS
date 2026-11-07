@echo off
REM Starts JewelryOS in development mode (demo data on). Open http://localhost:5080
cd /d "%~dp0backend\JewelryOS.Api"
dotnet run
pause
