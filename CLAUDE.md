# JewelryOS — notes for Claude Code

Inventory, pricing and invoicing app for a gold jewelry store in Iran. Real store use (not a demo):
staff are non-technical, the UI is Persian and right-to-left, and the store PC may have no reliable internet.
The owner of this repo (Arta) talks in Persian; reply in Persian unless asked otherwise.

## Run / build / test (Windows, from repo root)

| Task | Command |
|---|---|
| Run app (demo data, http://localhost:5080) | `run.bat` or `cd backend\JewelryOS.Api; dotnet run` |
| UI with live reload (http://localhost:4200, needs the backend running) | `cd frontend; npm install; npm start` |
| Build UI into `backend/JewelryOS.Api/wwwroot` | `cd frontend; npx ng build` |
| Backend tests (xUnit) | `cd backend; dotnet test` |
| Frontend tests (Vitest) | `cd frontend; npx ng test --watch=false` |
| New DB migration after a model change | `.\db-migration.bat Name` |
| Desktop app in dev mode (Electron) | `desktop-dev.bat` |
| Desktop installer for the store | `build-desktop.bat` → `desktop\dist\JewelryOS Setup x.y.z.exe` |

Always run `ng build` before finishing UI work: the backend serves the built files from `wwwroot`, and the
installer bundles whatever is in `wwwroot`. Bump `version` in `desktop/package.json` for each release to the store.

## Layout

- `backend/JewelryOS.Api` — ASP.NET Core 8 Minimal API, single project.
  - `Domain/Entities.cs` — all entities. `Data/AppDb.cs` — EF Core model. `Data/DbSetup.cs` — migrations + auto-backup.
  - `Data/Seed.cs` — first owner account + synthetic demo data (Development only).
  - `Services/` — `Pricing.cs` (pure, unit-tested), `SalesService.cs` (sale/void/return, stock moves), `ImportService.cs` (Excel),
    `InvoicePdf.cs` (QuestPDF, RTL A5), `Common.cs` (AppException, audit, Persian number parsing/formatting).
  - `Endpoints/` — route groups. `Program.cs` — auth, CSRF header check, error handler, startup.
- `backend/JewelryOS.Tests` — xUnit (pricing math, concurrent stock, void, Excel parsing) on in-memory SQLite.
- `frontend` — Angular 22, standalone components, **zoneless + signals**, Angular Material, `src/app/pages/*.ts` (inline templates),
  `src/app/core/` (api.ts = all HTTP calls + types, auth.ts, fa.ts = Persian pipes/number parsing, dialogs.ts).
- `desktop` — Electron shell: starts the published server exe from `resources/backend`, data in `%APPDATA%\JewelryOS\data`.
- `docs/pricing.md` — pricing formula and the open questions for the store owner. `sample-data/` — synthetic Excel files.

## Rules that must not be broken

- Money and weights are `decimal` in C# — never `double`/`float`. Every money component is rounded to whole currency units.
- SQLite cannot ORDER BY / SUM / compare `decimal` in SQL: do decimal aggregation in memory (see `/api/dashboard`). Store timestamps as UTC `DateTime` (not `DateTimeOffset`).
- Stock changes only through `Inventory.MoveAsync` (conditional UPDATE + `InventoryMovement` row with reason and actor). Never set `StockQuantity` directly.
- Invoices store a snapshot of rate, percentages and every line amount; never recalculate a saved invoice. Void/return change status and add compensating movements — never delete invoices or movements.
- Important actions call `Audit.Log(...)`. Owner-only actions are enforced on the server (`RequireAuthorization("Owner")`), not just hidden in the UI.
- Every state-changing API call needs header `X-Requested-With: JewelryOS` (added by `apiInterceptor`).
- After changing `Domain/Entities.cs` or `Data/AppDb.cs`, create a migration (`db-migration.bat`). Never edit or delete a migration that has shipped to the store.
- Pricing rules (profit %, VAT %, VAT base, rounding) live in `StoreSettings` and the Settings page — do not hard-code them. They are not yet confirmed by the store owner (`docs/pricing.md`).
- No real customer or store data in the repo; sample data must stay synthetic.

## UI conventions

- All user-facing text in Persian. Layout is RTL (`<html dir="rtl">`); use `.ltr` for codes/phones.
- Component state in `signal()`s (zoneless change detection — plain fields set inside `subscribe` won't re-render).
  Form inputs use `[(ngModel)]` on plain fields; numeric inputs are `type="text"` + `parseNumber()` so Persian digits work.
- Show money with the `money` pipe, numbers with `faNum`, dates with `faDate` (Jalali, Tehran time), enums with `label`.
- Errors: `errorMessage(e)` → snackbar or `.error-box`. Confirmations: `Dialogs.confirm/prompt` (no `window.confirm`).
- Fonts and icons are bundled locally (no CDNs) because the store may be offline or behind filtering.

## Known gaps / next ideas

Partial returns, discounts, product photos, buying old gold from customers, split payments, HTTPS for internet hosting,
auto-update for the desktop app.
