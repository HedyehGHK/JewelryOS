import { Component, OnInit, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { Api, Invoice, errorMessage } from '../core/api';
import { Auth } from '../core/auth';
import { Dialogs } from '../core/dialogs';
import { FA_PIPES } from '../core/fa';

@Component({
  selector: 'app-invoice-detail',
  imports: [RouterLink, MatButtonModule, ...FA_PIPES],
  template: `
  <div class="page">
    <div class="page-head">
      <a mat-button routerLink="/invoices"><span class="material-symbols-outlined">arrow_forward</span> فاکتورها</a>
      <h1>فاکتور شماره {{ inv()?.number | faNum }}</h1>
      @if (inv(); as i) {
        <a mat-flat-button [href]="api.invoicePdfUrl(i.id)" target="_blank"><span class="material-symbols-outlined">print</span> چاپ / PDF</a>
        <a mat-stroked-button [href]="api.invoicePdfUrl(i.id, true)"><span class="material-symbols-outlined">download</span> دانلود</a>
        @if (auth.isOwner() && i.status === 'Issued') {
          <button mat-button (click)="close('return')">ثبت مرجوعی</button>
          <button mat-button class="danger" (click)="close('void')">ابطال فاکتور</button>
        }
      }
    </div>
    @if (error()) { <div class="error-box">{{ error() }}</div> }

    @if (inv(); as i) {
      @if (i.status !== 'Issued') {
        <div class="error-box">
          این فاکتور {{ i.status | label }} است — {{ i.closedAt | faDate }} توسط {{ i.closedByName }}. دلیل: {{ i.closeReason }}
          <div class="small">کالاها به موجودی برگشت داده شده‌اند.</div>
        </div>
      }
      <div class="grid-2">
        <div class="card">
          <dl class="spec">
            <dt>تاریخ</dt><dd class="num">{{ i.createdAt | faDate }}</dd>
            <dt>خریدار</dt><dd>{{ i.customerName || '—' }} <span class="num">{{ i.customerPhone }}</span></dd>
            <dt>فروشنده</dt><dd>{{ i.sellerName }}</dd>
            <dt>نرخ ۱۸ عیار</dt><dd class="num">{{ i.pricePerGram18k | money }}</dd>
            <dt>سود / مالیات</dt><dd class="num">{{ i.profitPercent | faNum }}٪ / {{ i.taxPercent | faNum }}٪ <span class="muted small">({{ i.taxBase | label }})</span></dd>
            @if (i.notes) { <dt>توضیحات</dt><dd>{{ i.notes }}</dd> }
          </dl>
        </div>
        <div class="card">
          <dl class="spec totals">
            <dt>ارزش طلا</dt><dd class="num">{{ i.goldTotal | money }}</dd>
            <dt>اجرت</dt><dd class="num">{{ i.wageTotal | money }}</dd>
            <dt>سود</dt><dd class="num">{{ i.profitTotal | money }}</dd>
            @if (i.stoneTotal) { <dt>سنگ</dt><dd class="num">{{ i.stoneTotal | money }}</dd> }
            <dt>مالیات</dt><dd class="num">{{ i.taxTotal | money }}</dd>
            @if (i.roundingAdjustment) { <dt>گرد کردن</dt><dd class="num">{{ i.roundingAdjustment | money }}</dd> }
            <dt><b>جمع کل</b></dt><dd class="num"><b class="grand">{{ i.grandTotal | money }}</b></dd>
          </dl>
        </div>
      </div>
      <div class="card">
        <h2>اقلام</h2>
        <div class="table-wrap">
          <table class="t">
            <thead><tr><th>کالا</th><th>عیار</th><th>وزن</th><th>تعداد</th><th class="hide-sm">ارزش طلا</th><th class="hide-sm">اجرت</th><th class="hide-sm">سود</th><th class="hide-sm">مالیات</th><th class="end">جمع</th></tr></thead>
            <tbody>
              @for (l of i.lines; track l.id) {
                <tr>
                  <td><a [routerLink]="['/products', l.productId]">{{ l.productName }}</a><div class="muted small num">{{ l.sku }}</div></td>
                  <td class="num">{{ l.purity | faNum }}</td>
                  <td class="num">{{ l.weightGrams | faNum }}</td>
                  <td class="num">{{ l.quantity | faNum }}</td>
                  <td class="num hide-sm">{{ l.goldValue | money }}</td>
                  <td class="num hide-sm">{{ l.wageAmount | money }} <span class="muted small">({{ l.wagePercent | faNum }}٪)</span></td>
                  <td class="num hide-sm">{{ l.profitAmount | money }}</td>
                  <td class="num hide-sm">{{ l.taxAmount | money }}</td>
                  <td class="end num"><b>{{ l.lineTotal | money }}</b></td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    }
  </div>`,
  styles: `
    .spec { display: grid; grid-template-columns: 130px 1fr; gap: 8px 12px; margin: 0; }
    .spec dt { color: var(--muted); } .spec dd { margin: 0; }
    .totals dd { text-align: left; }
    .grand { font-size: 20px; color: var(--gold); }
    .danger { color: var(--bad); }
  `,
})
export class InvoiceDetailPage implements OnInit {
  id = input.required<string>();
  protected api = inject(Api);
  protected auth = inject(Auth);
  private dialogs = inject(Dialogs);
  private snack = inject(MatSnackBar);
  inv = signal<Invoice | null>(null);
  error = signal('');

  ngOnInit() { this.load(); }

  load() {
    this.api.invoice(+this.id()).subscribe({ next: i => this.inv.set(i), error: e => this.error.set(errorMessage(e)) });
  }

  async close(kind: 'void' | 'return') {
    const i = this.inv(); if (!i) return;
    const title = kind === 'void' ? 'ابطال فاکتور' : 'ثبت مرجوعی';
    const reason = await this.dialogs.prompt(title, 'دلیل', {
      message: 'فاکتور حذف نمی‌شود؛ وضعیت آن تغییر می‌کند و کالاها به موجودی برمی‌گردند. این کار قابل بازگشت نیست.',
      confirmText: title, danger: true,
    });
    if (!reason) return;
    try {
      await firstValueFrom(kind === 'void' ? this.api.voidInvoice(i.id, reason) : this.api.returnInvoice(i.id, reason));
      this.snack.open('ثبت شد و موجودی برگشت داده شد.', 'باشه');
      this.load();
    } catch (e) { this.snack.open(errorMessage(e), 'باشه', { duration: 8000 }); }
  }
}
