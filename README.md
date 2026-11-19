# JewelryOS — Inventory, Pricing & Invoicing for a Jewelry Store

[نسخه فارسی (Persian version)](README.fa.md)

A web and desktop application for a gold jewelry store: product catalog, Excel import, daily gold rate, automatic pricing, Persian PDF invoices, invoice cancellation and returns, a dashboard, and an activity log.
The user interface is fully Persian and right-to-left (RTL), and it works on desktop, tablet, and mobile across the store's local network. The app is in daily use at a family-owned jewelry store.

| Layer | Technology |
|---|---|
| Front end | Angular 22 + Angular Material (RTL, bundled Vazirmatn font — no internet required) |
| Back end | ASP.NET Core 8 (Minimal API) |
| Database | SQLite (single file) with EF Core Migrations |
| PDF invoices | QuestPDF (A5, right-to-left, Persian/Jalali dates) |
| Excel | ClosedXML |
| Tests | xUnit (pricing, concurrent sales, cancellation, Excel import) + Vitest |
| Desktop | Electron (Windows installer, runs offline) |
| CI | GitHub Actions (build and test on every push) |

---

## Quick start (Windows)

Prerequisite: [.NET SDK 8 or later](https://dotnet.microsoft.com/download).

1. Double-click `run.bat` (or in a terminal: `cd backend/JewelryOS.Api` then `dotnet run`).
2. Open a browser at **http://localhost:5080**
3. Sign in with **admin / admin1234** (you will be asked to change the password after signing in).
   In development mode a sample seller account is also created: **seller / seller1234**.

In development mode (`run.bat`), **mock data** (15 products and a sample gold rate) is created so you can try the app.
The front end is prebuilt into `backend/JewelryOS.Api/wwwroot`, so Node.js is not needed for a simple run.

### Running tests
`test.bat` or `cd backend && dotnet test`

### Desktop version (recommended for the store)
The app is packaged as a Windows application with an installer (Electron). The server starts automatically in the background, so no browser is needed.

1. Prerequisites on the build machine: .NET SDK 8+ and [Node.js 20+](https://nodejs.org).
2. Run `build-desktop.bat`. The first build takes a few minutes.
3. Output: `desktop\dist\JewelryOS Setup 1.0.0.exe` — this single file is all the store needs.
4. Install it at the store. Because the installer is not digitally signed, Windows may show "Windows protected your PC": click **More info → Run anyway**.
5. Data is stored in `%APPDATA%\JewelryOS\data\jewelryos.db` and is **not** deleted when the app is uninstalled or updated.
6. While the app is open, phones and other computers on the same network can connect using the address shown on the **Settings** page.
   The window menu appears when you press Alt.
7. Port and network access settings: `%APPDATA%\JewelryOS\config.json` (`port`, `allowNetwork`).

To try the desktop version in development mode (with sample data): `desktop-dev.bat`

### Store installation without Electron
1. Run `publish-store.bat`. This creates a `publish` folder that runs on Windows **without installing .NET**.
2. Copy the folder to the store computer and run `JewelryOS.Api.exe`.
3. On the same computer: `http://localhost:5080` — on other devices on the store network: `http://<computer-IP>:5080`
   (you may need to open port 5080 in Windows Firewall).
4. In production mode, sample data is **not** created. First enter the daily gold rate, then import products from Excel.
5. You can change the default password before the first run in `appsettings.json` (the `Seed` section).

### Backups
- An admin can download a consistent copy of the database from **Settings → Download backup**.
- Or copy `storage/jewelryos.db` (next to the app) while the app is closed.
- To restore: close the app, place the backup file named `jewelryos.db` in the `data` folder, and start the app again.
- Recommendation: keep a nightly copy on a USB drive or another computer.

### Front-end development
```
cd frontend
npm install
npm start          # http://localhost:4200 (requests to /api are proxied to the server on 5080)
npx ng build       # outputs directly to backend/JewelryOS.Api/wwwroot
npx ng test --watch=false
```

---

## Pricing

Details and a worked example are in [docs/pricing.md](docs/pricing.md). Summary:

```
Gold value   = weight × price per gram of 18K × purity ÷ 750
Labour       = gold value × product labour %
Profit       = (gold value + labour) × 7%
Tax          = (labour + profit + stones) × 10%     ← can be switched to "total amount" in Settings
Line total   = gold + labour + profit + stones + tax
Invoice total is rounded to the nearest 1,000
```

Profit %, tax %, tax base, and rounding unit can all be changed on the **Settings** page.
**Before real use, confirm these numbers with the store owner and current regulations.**

## Database schema changes (Migrations)

Whenever you change the data model (`Domain/Entities.cs` or `Data/AppDb.cs`), create a migration:

```
.\db-migration.bat AddSomethingName
```

On the next run, the app takes a backup in a `backups` folder next to the database **before** applying the change, then updates the tables; existing data is preserved.
First time only: `.\db-migration.bat InitialCreate`. Databases created before that are automatically linked to this migration.
Never manually edit or delete files in `Data/Migrations` that have already been released.

## Roles

| Action | Seller | Admin |
|---|:-:|:-:|
| Search and view products, inventory, and invoices | ✓ | ✓ |
| Make sales, issue invoices, print PDF | ✓ | ✓ |
| Change labour % on an invoice | | ✓ |
| Enter the daily gold rate | | ✓ |
| Add/edit products, adjust inventory, archive | | ✓ |
| Cancel and return invoices | | ✓ |
| Excel import, users, settings, activity log, backups | | ✓ |

All of these restrictions are enforced **on the server** (not just by hiding buttons).

## Excel file format

The first row contains column headers. Columns are detected by their header and can be remapped on the preview page.
Sample file: `sample-data/products-template-sample.xlsx` (or the "Template with sample data" button in the app).

| Column | Required | Notes |
|---|:-:|---|
| Product code | ✓ | Unique. If the code already exists, the product is updated (or skipped, depending on your choice) — duplicates are never created |
| Product name | ✓ | |
| Category | | Ring, necklace, … |
| Purity | | 750 (default) or 875, 900, … — 18/21/24 karat values are also accepted and converted to parts per thousand |
| Weight (grams) | ✓ | Persian digits and "٫" or "/" as the decimal separator are accepted |
| Labour % | | e.g. 18 or 18% |
| Stone value | | Fixed amount per item |
| Stock | | Number of units in stock (zero or more). Empty = 1 |
| Notes | | |

The old "Type (single/multiple)" column is no longer used; if it appears in older files, it is ignored.

The file `sample-data/products-messy-test.xlsx` intentionally contains errors so you can test validation.

## Data design principles

- Amounts are always `decimal` (never float).
- Every inventory change creates a row in the inventory history with a reason and user name; no history is ever deleted.
- Each invoice stores a **snapshot of its prices** (rate, labour, profit, and tax per line), so later changes to rates or settings do not affect past invoices.
- A sale, its invoice lines, and the stock deduction are saved in a single transaction. Stock is deducted with `UPDATE … WHERE stock is sufficient`, so two sellers can never sell the same item twice at the same time.
- Cancelling or returning an invoice does not delete it; it changes the status and restores stock with a compensating movement.
- Every important action (sign-in, sale, cancellation, rate and settings changes, inventory adjustments, Excel import) is recorded in the activity log.

## Project structure

```
backend/JewelryOS.Api     Server (Program.cs, Domain, Data, Services, Endpoints, Fonts, wwwroot)
backend/JewelryOS.Tests   xUnit tests
frontend                  Angular (src/app/pages, src/app/core)
sample-data               Mock Excel files
docs                      Project plan, pricing formula, notes
.github/workflows/ci.yml  Automated build and test on GitHub
```

## Limitations and next steps

- Returns are only supported for a whole invoice (partial returns are not implemented yet).
- There is no separate discount; an admin can lower the labour % on an invoice.
- HTTPS is not configured for the local network; if the app is ever exposed to the internet, HTTPS must be enabled.
- Product photos, buying used gold from customers, and split payments (cash/card) are planned for a future version.

Vazirmatn font license: SIL OFL (`backend/JewelryOS.Api/Fonts/OFL.txt`). QuestPDF is free under its Community license for businesses with annual revenue under USD 1 million.
