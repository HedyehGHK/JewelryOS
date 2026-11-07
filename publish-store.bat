@echo off
REM Builds a self-contained Windows version for the store PC (no .NET install needed there).
REM Output: publish\JewelryOS.Api.exe  -> run it, then open http://localhost:5080
cd /d "%~dp0"
if exist frontend\node_modules (
  pushd frontend && call npx ng build && popd
) else (
  echo [info] frontend\node_modules not found - using the already built UI in backend\JewelryOS.Api\wwwroot
)
dotnet publish backend\JewelryOS.Api\JewelryOS.Api.csproj -c Release -r win-x64 --self-contained true -o publish
echo.
echo Done. Copy the "publish" folder to the store PC and run JewelryOS.Api.exe
pause
