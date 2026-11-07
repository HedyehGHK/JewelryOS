@echo off
REM Opens the desktop app in development mode (uses dotnet run, demo data on).
cd /d "%~dp0desktop"
if not exist node_modules call npm install
call npm start
