import { HttpClient, HttpErrorResponse, HttpInterceptorFn, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

// ---------- Types (mirror the ASP.NET Core API) ----------
export type Role = 'Owner' | 'Seller';
export type ProductStatus = 'Active' | 'Archived';
export type InvoiceStatus = 'Issued' | 'Voided' | 'Returned';
export type TaxBase = 'WageAndProfit' | 'WholePrice';

export interface Me { id: number; username: string; displayName: string; role: Role; mustChangePassword: boolean; }

export interface Product {
  id: number; sku: string; name: string; category: string; purity: number; weightGrams: number;
  wagePercent: number; stoneValue: number; stockQuantity: number;
  status: ProductStatus; notes: string | null; createdAt: string; updatedAt: string;
}

export interface Movement {
  id: number; productId: number; sku?: string; productName?: string; quantityChange: number; balanceAfter: number;
  type: string; reason: string | null; actorName: string; invoiceId: number | null; importBatchId: number | null; createdAt: string;
}

export interface PriceRate { id: number; pricePerGram18k: number; effectiveAt: string; source: string | null; createdByName: string; }

export interface Settings {
  storeName: string; address: string | null; phone: string | null; profitPercent: number; taxPercent: number;
  taxBase: TaxBase; roundingUnit: number; currencyLabel: string; invoiceFooter: string | null; lowStockThreshold: number;
}

export interface LinePrice { goldValue: number; wageAmount: number; profitAmount: number; stoneValue: number; taxAmount: number; lineTotal: number; }

export interface Quote {
  pricePerGram18k: number; profitPercent: number; taxPercent: number; taxBase: TaxBase;
  lines: { productId: number; sku: string; name: string; quantity: number; wagePercent: number; price: LinePrice }[];
  goldTotal: number; wageTotal: number; profitTotal: number; stoneTotal: number; taxTotal: number;
  roundingAdjustment: number; grandTotal: number;
}

export interface SaleLine { productId: number; quantity: number; wagePercent?: number | null; }
export interface SaleRequest { lines: SaleLine[]; customerName?: string; customerPhone?: string; notes?: string; }

export interface InvoiceSummary {
  id: number; number: number; status: InvoiceStatus; customerName: string | null; customerPhone: string | null;
  sellerName: string; grandTotal: number; createdAt: string; lineCount: number;
}

export interface InvoiceLine {
  id: number; productId: number; sku: string; productName: string; purity: number; weightGrams: number; quantity: number;
  wagePercent: number; goldValue: number; wageAmount: number; profitAmount: number; stoneValue: number; taxAmount: number; lineTotal: number;
}

export interface Invoice extends Omit<InvoiceSummary, 'lineCount'> {
  pricePerGram18k: number; profitPercent: number; taxPercent: number; taxBase: TaxBase;
  goldTotal: number; wageTotal: number; profitTotal: number; stoneTotal: number; taxTotal: number; roundingAdjustment: number;
  notes: string | null; closedAt: string | null; closedByName: string | null; closeReason: string | null; lines: InvoiceLine[];
}

export interface ImportPreview {
  id: number; fileName: string; status: 'Previewed' | 'Committed' | 'Discarded';
  totalRows: number; errorRows: number; createdCount: number; updatedCount: number; skippedCount: number;
  uploadedAt: string; committedAt: string | null; headers: string[]; mapping: Record<string, number>;
  rows: { rowNumber: number; sku: string | null; action: 'Create' | 'Update' | 'Skip' | 'Error'; errors: string | null; cells: string[];
          parsed: { sku: string; name: string; category: string; purity: number; weightGrams: number; wagePercent: number;
                    stoneValue: number; stock: number; notes: string | null } | null }[];
}

export interface Dashboard {
  days: number; currency: string; currentRate: number | null; rateUpdatedAt: string | null;
  todaySalesTotal: number; todayInvoiceCount: number; periodSalesTotal: number; periodInvoiceCount: number;
  stockPieces: number; stockGrams18k: number; stockGoldValue: number | null;
  salesByDay: { date: string; total: number; count: number }[];
  salesByCategory: { category: string; total: number; pieces: number }[];
  stockByCategory: { category: string; pieces: number; grams: number }[];
  lowStock: { id: number; sku: string; name: string; stockQuantity: number }[];
}

export type ImportBatchRow = Omit<ImportPreview, 'headers' | 'mapping' | 'rows'> & { uploadedByName: string };

export interface UserRow { id: number; username: string; displayName: string; role: Role; isActive: boolean; createdAt: string; }
export interface AuditRow { id: number; actorName: string; action: string; resourceType: string; resourceId: string | null; summary: string | null; createdAt: string; }

/** Adds the CSRF header and turns API errors into a readable Persian message. */
export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const r = req.url.startsWith('/api') ? req.clone({ setHeaders: { 'X-Requested-With': 'JewelryOS' } }) : req;
  return next(r).pipe(catchError((e: HttpErrorResponse) => {
    if (e.status === 401 && !req.url.includes('/api/auth/')) router.navigateByUrl('/login');
    return throwError(() => e);
  }));
};

export function errorMessage(e: unknown): string {
  if (e instanceof HttpErrorResponse) {
    const m = (e.error as { message?: string } | null)?.message;
    if (m) return m;
    if (e.status === 0) return 'ارتباط با سرور برقرار نشد. اتصال شبکه یا روشن بودن برنامه را بررسی کنید.';
    if (e.status === 403) return 'شما اجازه انجام این کار را ندارید.';
    if (e.status === 429) return 'تعداد تلاش‌ها زیاد بود. یک دقیقه بعد دوباره امتحان کنید.';
    return `خطا (${e.status})`;
  }
  return 'خطای ناشناخته';
}

function params(o: Record<string, unknown>): HttpParams {
  let p = new HttpParams();
  for (const [k, v] of Object.entries(o)) if (v !== undefined && v !== null && v !== '') p = p.set(k, String(v));
  return p;
}

@Injectable({ providedIn: 'root' })
export class Api {
  private http = inject(HttpClient);

  // auth
  me() { return this.http.get<Me>('/api/auth/me'); }
  login(username: string, password: string) { return this.http.post<Me>('/api/auth/login', { username, password }); }
  logout() { return this.http.post<void>('/api/auth/logout', {}); }
  changePassword(currentPassword: string, newPassword: string) { return this.http.post<Me>('/api/auth/change-password', { currentPassword, newPassword }); }

  // users
  users() { return this.http.get<UserRow[]>('/api/users'); }
  createUser(u: { username: string; displayName: string; password: string; role: Role }) { return this.http.post<{ id: number }>('/api/users', u); }
  updateUser(id: number, u: { displayName: string; role: Role; isActive: boolean }) { return this.http.put<void>(`/api/users/${id}`, u); }
  resetPassword(id: number, newPassword: string) { return this.http.post<void>(`/api/users/${id}/reset-password`, { newPassword }); }

  // products
  products(f: { q?: string; category?: string; status?: ProductStatus; inStock?: boolean | null } = {}) {
    return this.http.get<Product[]>('/api/products', { params: params(f) });
  }
  categories() { return this.http.get<string[]>('/api/products/categories'); }
  product(id: number) { return this.http.get<{ product: Product; movements: Movement[] }>(`/api/products/${id}`); }
  productBySku(sku: string) { return this.http.get<Product>(`/api/products/by-sku/${encodeURIComponent(sku)}`); }
  createProduct(p: Partial<Product> & { initialStock?: number }) { return this.http.post<Product>('/api/products', p); }
  updateProduct(id: number, p: Partial<Product>) { return this.http.put<Product>(`/api/products/${id}`, p); }
  adjustStock(id: number, change: number, reason: string) { return this.http.post<{ stockQuantity: number }>(`/api/products/${id}/adjust`, { change, reason }); }
  archive(id: number) { return this.http.post<Product>(`/api/products/${id}/archive`, {}); }
  restore(id: number) { return this.http.post<Product>(`/api/products/${id}/restore`, {}); }
  movements(page = 1) { return this.http.get<Movement[]>('/api/movements', { params: params({ page }) }); }

  // rates & settings
  rates() { return this.http.get<{ current: PriceRate | null; history: PriceRate[] }>('/api/rates'); }
  addRate(pricePerGram18k: number, source: string) { return this.http.post<PriceRate>('/api/rates', { pricePerGram18k, source }); }
  settings() { return this.http.get<Settings>('/api/settings'); }
  saveSettings(s: Settings) { return this.http.put<Settings>('/api/settings', s); }

  // sales & invoices
  quote(r: SaleRequest) { return this.http.post<Quote>('/api/sales/quote', r); }
  sell(r: SaleRequest) { return this.http.post<{ id: number; number: number }>('/api/sales', r); }
  invoices(f: { q?: string; status?: InvoiceStatus | ''; from?: string; to?: string; page?: number } = {}) {
    return this.http.get<InvoiceSummary[]>('/api/invoices', { params: params(f) });
  }
  invoice(id: number) { return this.http.get<Invoice>(`/api/invoices/${id}`); }
  invoicePdfUrl(id: number, download = false) { return `/api/invoices/${id}/pdf${download ? '?download=true' : ''}`; }
  voidInvoice(id: number, reason: string) { return this.http.post<Invoice>(`/api/invoices/${id}/void`, { reason }); }
  returnInvoice(id: number, reason: string) { return this.http.post<Invoice>(`/api/invoices/${id}/return`, { reason }); }

  // imports
  importFields() { return this.http.get<{ field: string; label: string }[]>('/api/imports/fields'); }
  imports() { return this.http.get<ImportBatchRow[]>('/api/imports'); }
  importBatch(id: number) { return this.http.get<ImportPreview>(`/api/imports/${id}`); }
  upload(file: File) {
    const fd = new FormData(); fd.append('file', file, file.name);
    return this.http.post<ImportPreview>('/api/imports', fd);
  }
  revalidate(id: number, mapping: Record<string, number> | null, updateExisting: boolean) {
    return this.http.post<ImportPreview>(`/api/imports/${id}/revalidate`, { mapping, updateExisting });
  }
  commitImport(id: number, updateExisting: boolean) { return this.http.post<ImportPreview>(`/api/imports/${id}/commit`, { updateExisting }); }
  discardImport(id: number) { return this.http.post<void>(`/api/imports/${id}/discard`, {}); }
  templateUrl(sample: boolean) { return `/api/imports/template?sample=${sample}`; }

  // reports
  dashboard(days = 30) { return this.http.get<Dashboard>('/api/dashboard', { params: params({ days }) }); }
  audit(page = 1, action?: string) { return this.http.get<AuditRow[]>('/api/audit', { params: params({ page, action }) }); }
  backupUrl() { return '/api/backup'; }
  system() { return this.http.get<{ addresses: string[]; databaseFile: string; version: string }>('/api/system'); }
}
