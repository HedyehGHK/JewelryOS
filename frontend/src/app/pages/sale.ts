import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Subject, debounceTime, firstValueFrom, switchMap, catchError, of } from 'rxjs';
import { Api, PriceRate, Product, Quote, errorMessage } from '../core/api';
import { Auth } from '../core/auth';
import { FA_PIPES, faMoney, parseNumber } from '../core/fa';
import { Dialogs } from '../core/dialogs';

interface CartLine { product: Product; quantity: number; wageText: string; }

@Component({
  selector: 'app-sale',
  imports: [FormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule, MatProgressBarModule, ...FA_PIPES],
  template: `
  <div class="page">
    <div class="page-head">
      <h1>فروش جدید</h1>
      @if (rate(); as r) {
        <span class="badge gold big">نرخ ۱۸ عیار: <b class="num">{{ r.pricePerGram18k | money }}</b> {{ currency() }} — {{ r.effectiveAt | faDate }}</span>
      } @else if (rateLoaded()) {
        <span class="badge bad big">نرخ روز ثبت نشده — <a routerLink="/rates">ثبت نرخ</a></span>
      }
    </div>

    <div class="layout">
      <section class="left">
        <div class="card">
          <h2>افزودن کالا</h2>
          <mat-form-field>
            <mat-label>کد کالا (بارکد) یا نام</mat-label>
            <input matInput [(ngModel)]="search" (ngModelChange)="search$.next($event)" (keydown.enter)="addExact()" autofocus
                   placeholder="مثلاً R-1001 — با Enter مستقیم اضافه می‌شود">
          </mat-form-field>
          @if (results().length) {
            <div class="results">
              @for (p of results(); track p.id) {
                <button type="button" class="result" (click)="add(p)" [disabled]="p.stockQuantity < 1 || inCart(p.id)">
                  <span class="sku num">{{ p.sku }}</span>
                  <span class="grow">{{ p.name }} <span class="muted small">— {{ p.weightGrams | faNum }} گرم، عیار {{ p.purity | faNum }}</span></span>
                  @if (inCart(p.id)) { <span class="badge">در سبد</span> }
                  @else if (p.stockQuantity < 1) { <span class="badge bad">ناموجود</span> }
                  @else { <span class="badge ok">موجودی {{ p.stockQuantity | faNum }}</span> }
                </button>
              }
            </div>
          } @else if (search.trim() && searched()) {
            <div class="muted small">کالایی پیدا نشد.</div>
          }
        </div>

        <div class="card">
          <h2>سبد خرید</h2>
          @if (!cart().length) {
            <div class="empty">هنوز کالایی اضافه نشده است.</div>
          } @else {
            <div class="table-wrap">
              <table class="t">
                <thead><tr><th>کالا</th><th>وزن</th><th>تعداد</th><th>اجرت ٪</th><th class="end">جمع</th><th></th></tr></thead>
                <tbody>
                  @for (l of cart(); track l.product.id; let i = $index) {
                    <tr>
                      <td><b>{{ l.product.name }}</b><div class="muted small num">{{ l.product.sku }} · عیار {{ l.product.purity | faNum }}</div></td>
                      <td class="num">{{ l.product.weightGrams | faNum }}</td>
                      <td>
                        @if (l.product.trackingMode === 'Quantity') {
                          <input class="mini" type="number" min="1" [max]="l.product.stockQuantity" [ngModel]="l.quantity" (ngModelChange)="setQty(i, $event)">
                        } @else { ۱ }
                      </td>
                      <td>
                        @if (auth.isOwner()) {
                          <input class="mini" inputmode="decimal" [ngModel]="l.wageText" (ngModelChange)="setWage(i, $event)">
                        } @else { <span class="num">{{ l.product.wagePercent | faNum }}</span> }
                      </td>
                      <td class="end num">{{ quote()?.lines?.[i]?.price?.lineTotal | money }}</td>
                      <td><button mat-icon-button (click)="remove(i)" aria-label="حذف"><span class="material-symbols-outlined">delete</span></button></td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </div>
      </section>

      <aside class="right">
        <div class="card sticky">
          <h2>خلاصه فاکتور</h2>
          @if (quoting()) { <mat-progress-bar mode="indeterminate" /> }
          @if (quoteError()) { <div class="error-box">{{ quoteError() }}</div> }
          @if (quote(); as q) {
            <dl class="sum">
              <dt>ارزش طلا</dt><dd class="num">{{ q.goldTotal | money }}</dd>
              <dt>اجرت ساخت</dt><dd class="num">{{ q.wageTotal | money }}</dd>
              <dt>سود فروشنده ({{ q.profitPercent | faNum }}٪)</dt><dd class="num">{{ q.profitTotal | money }}</dd>
              @if (q.stoneTotal) { <dt>سنگ و اضافات</dt><dd class="num">{{ q.stoneTotal | money }}</dd> }
              <dt>مالیات ({{ q.taxPercent | faNum }}٪)</dt><dd class="num">{{ q.taxTotal | money }}</dd>
              @if (q.roundingAdjustment) { <dt>گرد کردن</dt><dd class="num">{{ q.roundingAdjustment | money }}</dd> }
            </dl>
            <div class="grand"><span>مبلغ قابل پرداخت</span><b class="num">{{ q.grandTotal | money }} {{ currency() }}</b></div>
          }

          <mat-form-field><mat-label>نام خریدار (اختیاری)</mat-label><input matInput [(ngModel)]="customerName" maxlength="120"></mat-form-field>
          <mat-form-field><mat-label>تلفن خریدار (اختیاری)</mat-label><input matInput [(ngModel)]="customerPhone" dir="ltr" maxlength="30" inputmode="tel"></mat-form-field>
          <mat-form-field><mat-label>توضیحات</mat-label><textarea matInput [(ngModel)]="notes" rows="2" maxlength="500"></textarea></mat-form-field>

          <button mat-flat-button class="big-btn full-btn" (click)="submit()" [disabled]="!canSubmit()">
            <span class="material-symbols-outlined">receipt_long</span> {{ saving() ? 'در حال ثبت…' : 'ثبت فاکتور و کسر از موجودی' }}
          </button>
          @if (cart().length) { <button mat-button class="full-btn" (click)="clear()">پاک کردن سبد</button> }
        </div>
      </aside>
    </div>
  </div>`,
  styles: `
    .layout { display: grid; grid-template-columns: minmax(0, 1fr) 360px; gap: 16px; align-items: start; }
    @media (max-width: 1000px) { .layout { grid-template-columns: 1fr; } }
    .badge.big { font-size: 13px; padding: 6px 14px; }
    .results { display: flex; flex-direction: column; gap: 6px; max-height: 340px; overflow: auto; }
    .result { display: flex; gap: 10px; align-items: center; text-align: right; padding: 10px 12px; border: 1px solid var(--line); border-radius: 10px; background: #fff; cursor: pointer; font: inherit; color: inherit; }
    .result:hover:not(:disabled) { border-color: var(--gold); background: #fffaf0; }
    .result:disabled { opacity: .6; cursor: default; }
    .sku { font-weight: 700; color: var(--gold); min-width: 70px; }
    .mini { width: 64px; padding: 6px 8px; border: 1px solid var(--line); border-radius: 8px; font: inherit; text-align: center; }
    .sticky { position: sticky; top: 76px; }
    .sum { display: grid; grid-template-columns: 1fr auto; gap: 6px 10px; margin: 0 0 12px; }
    .sum dt { color: var(--muted); } .sum dd { margin: 0; text-align: left; }
    .grand { display: flex; justify-content: space-between; align-items: center; gap: 8px; background: var(--gold-soft); border-radius: 12px; padding: 14px; margin-bottom: 14px; font-size: 15px; }
    .grand b { font-size: 20px; }
    .full-btn { width: 100%; margin-top: 6px; }
  `,
})
export class SalePage implements OnInit {
  private api = inject(Api);
  private router = inject(Router);
  private snack = inject(MatSnackBar);
  protected auth = inject(Auth);
  private dialogs = inject(Dialogs);

  search = '';
  customerName = '';
  customerPhone = '';
  notes = '';

  search$ = new Subject<string>();
  private quote$ = new Subject<void>();

  results = signal<Product[]>([]);
  searched = signal(false);
  cart = signal<CartLine[]>([]);
  quote = signal<Quote | null>(null);
  quoting = signal(false);
  quoteError = signal('');
  saving = signal(false);
  rate = signal<PriceRate | null>(null);
  rateLoaded = signal(false);
  currency = signal('تومان');

  canSubmit = computed(() => this.cart().length > 0 && !!this.quote() && !this.quoting() && !this.quoteError() && !this.saving());

  ngOnInit() {
    this.api.rates().subscribe({ next: r => { this.rate.set(r.current); this.rateLoaded.set(true); }, error: () => this.rateLoaded.set(true) });
    this.api.settings().subscribe(s => this.currency.set(s.currencyLabel));

    this.search$.pipe(debounceTime(200), switchMap(q => q.trim()
      ? this.api.products({ q: q.trim() }).pipe(catchError(() => of([] as Product[])))
      : of([] as Product[])))
      .subscribe(r => { this.results.set(r.slice(0, 30)); this.searched.set(true); });

    this.quote$.pipe(debounceTime(250), switchMap(() => {
      if (!this.cart().length) { this.quote.set(null); this.quoting.set(false); return of(null); }
      this.quoting.set(true);
      return this.api.quote(this.request()).pipe(catchError(e => { this.quoteError.set(errorMessage(e)); this.quote.set(null); return of(null); }));
    })).subscribe(q => { this.quoting.set(false); if (q) { this.quote.set(q); this.quoteError.set(''); } });
  }

  inCart(id: number) { return this.cart().some(l => l.product.id === id); }

  add(p: Product) {
    if (this.inCart(p.id) || p.stockQuantity < 1) return;
    this.cart.update(c => [...c, { product: p, quantity: 1, wageText: String(p.wagePercent) }]);
    this.search = ''; this.results.set([]); this.searched.set(false);
    this.requote();
  }

  async addExact() {
    const q = this.search.trim();
    if (!q) return;
    const local = this.results().find(p => p.sku.toLowerCase() === q.toLowerCase());
    if (local) { this.add(local); return; }
    try { this.add(await firstValueFrom(this.api.productBySku(q))); }
    catch { if (this.results().length === 1) this.add(this.results()[0]); }
  }

  setQty(i: number, v: unknown) {
    const n = Math.max(1, Math.floor(parseNumber(v) || 1));
    this.cart.update(c => c.map((l, j) => j === i ? { ...l, quantity: Math.min(n, l.product.stockQuantity) } : l));
    this.requote();
  }

  setWage(i: number, v: string) {
    this.cart.update(c => c.map((l, j) => j === i ? { ...l, wageText: v } : l));
    this.requote();
  }

  remove(i: number) { this.cart.update(c => c.filter((_, j) => j !== i)); this.requote(); }
  clear() { this.cart.set([]); this.quote.set(null); this.quoteError.set(''); }

  private requote() { this.quoteError.set(''); this.quote$.next(); }

  private request() {
    return {
      lines: this.cart().map(l => {
        const w = parseNumber(l.wageText);
        return { productId: l.product.id, quantity: l.quantity, wagePercent: this.auth.isOwner() && Number.isFinite(w) && w !== l.product.wagePercent ? w : null };
      }),
      customerName: this.customerName, customerPhone: this.customerPhone, notes: this.notes,
    };
  }

  async submit() {
    const q = this.quote();
    if (!q || !(await this.dialogs.confirm('ثبت فاکتور', `مبلغ قابل پرداخت: ${faMoney(q.grandTotal)} ${this.currency()}\nپس از ثبت، کالاها از موجودی کسر می‌شوند.`, { confirmText: 'ثبت فاکتور' }))) return;
    this.saving.set(true);
    try {
      const inv = await firstValueFrom(this.api.sell(this.request()));
      this.snack.open(`فاکتور شماره ${new Intl.NumberFormat('fa-IR', { useGrouping: false }).format(inv.number)} ثبت شد.`, 'باشه');
      this.router.navigate(['/invoices', inv.id]);
    } catch (e) {
      this.snack.open(errorMessage(e), 'باشه', { duration: 8000 });
      this.requote();
    } finally {
      this.saving.set(false);
    }
  }
}
