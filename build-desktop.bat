@echo off
REM Builds the JewelryOS desktop installer (Electron + bundled server).
REM Needs: .NET SDK 8+, Node.js 20+, internet (first run downloads Electron and NSIS).
REM Output: desktop\dist\JewelryOS Setup 1.0.0.exe
cd /d "%~dp0"

if exist frontend\node_modules (
  echo [1/3] Building user interface...
  pushd frontend
  call npx ng build || goto fail
  popd
) else (
  echo [1/3] frontend\node_modules not found - using the already built UI in backend\JewelryOS.Api\wwwroot
)

echo [2/3] Publishing server...
if exist desktop\backend rmdir /s /q desktop\backend
dotnet publish backend\JewelryOS.Api\JewelryOS.Api.csproj -c Release -r win-x64 --self-contained true -o desktop\backend || goto fail

echo [3/3] Packaging desktop app...
pushd desktop
call npm install || goto fail
call npm run dist || goto fail
popd

echo.
echo Done! Installer: desktop\dist\JewelryOS Setup 1.0.0.exe
explorer desktop\dist
pause
exit /b 0

:fail
echo.
echo BUILD FAILED - copy the error above and send it.
pause
exit /b 1
