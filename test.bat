@echo off
REM Runs backend unit/integration tests
cd /d "%~dp0backend"
dotnet test
pause
