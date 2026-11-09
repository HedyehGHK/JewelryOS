import { Component, OnInit, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { Api, Movement, Product, errorMessage } from '../core/api';
import { Auth } from '../core/auth';
import { Dialogs } from '../core/dialogs';
import { FA_PIPES, parseNumber } from '../core/fa';
import { ProductDialog } from './product-dialog';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink, MatButtonModule, ...FA_PIPES],
  template: `
  <div class="page">
    <div class="page-head">
      <a mat-button routerLink="/products"><span class="material-symbols-outlined">arrow_forward</span> کالاها</a>
      <h1>{{ product()?.name ?? '…' }}</h1>
      @if (product(); as p) {
        @if (auth.isOwner()) {
          <button mat-stroked-button (click)="edit()"><span class="material-symbols-outlined">edit</span> ویرایش</button>
          <button mat-stroked-button (click)="adjust()"><span class="material-symbols-outlined">inventory</span> اصلاح موجودی</button>
          @if (p.status === 'Active') { <button mat-button (click)="archive()">بایگانی</button> }
          @else { <button mat-button (click)="restore()">بازگردانی</button> }
        }
      }
    </div>
    @if (error()) { <div class="error-box">{{ error() }}</div> }

    @if (product(); as p) {
      <div class="grid-2">
        <div class="card">
          <h2>مشخصات</h2>
          <dl class="spec">
            <dt>کد کالا</dt><dd class="num">{{ p.sku }}</dd>
            <dt>دسته‌بندی</dt><dd>{{ p.category || '—' }}</dd>
            <dt>عیار</dt><dd class="num">{{ p.purity | faNum }}</dd>
            <dt>وزن</dt><dd class="num">{{ p.weightGrams | faNum }} گرم</dd>
            <dt>اجرت</dt><dd class="num">{{ p.wagePercent | faNum }}٪</dd>
            <dt>سنگ و اضافات</dt><dd class="num">{{ p.stoneValue | money }}</dd>
            <dt>وضعیت</dt><dd>{{ p.status | label }}</dd>
            <dt>توضیحات</dt><dd>{{ p.notes || '—' }}</dd>
          </dl>
        </div>
        <div class="card stock">
          <h2>موجودی فعلی</h2>
          <div class="big num">{{ p.stockQuantity | faNum }}</div>
          <div class="muted">به‌روزرسانی: {{ p.updatedAt | faDate }}</div>
          @if (p.stockQuantity > 0 && p.status === 'Active') {
            <a mat-flat-button routerLink="/sale" class="big-btn">فروش این کالا</a>
          }
        </div>
      </div>

      <div class="card">
        <h2>تاریخچه موجودی</h2>
        <div class="table-wrap">
          <table class="t">
            <thead><tr><th>زمان</th><th>نوع</th><th>تغییر</th><th>موجودی بعد</th><th>شرح</th><th>کاربر</th></tr></thead>
            <tbody>
              @for (m of movements(); track m.id) {
                <tr>
                  <td class="num small">{{ m.createdAt | faDate }}</td>
                  <td>{{ m.type | label }}</td>
                  <td class="num"><span class="badge" [class.ok]="m.quantityChange > 0" [class.bad]="m.quantityChange < 0">{{ m.quantityChange > 0 ? '+' : '' }}{{ m.quantityChange | faNum }}</span></td>
                  <td class="num">{{ m.balanceAfter | faNum }}</td>
                  <td>
                    {{ m.reason || '—' }}
                    @if (m.invoiceId) { · <a [routerLink]="['/invoices', m.invoiceId]">مشاهده فاکتور</a> }
                  </td>
                  <td>{{ m.actorName }}</td>
                </tr>
              } @empty { <tr><td colspan="6" class="empty">بدون سابقه</td></tr> }
            </tbody>
          </table>
        </div>
      </div>
    }
  </div>`,
  styles: `
    .spec { display: grid; grid-template-columns: 120px 1fr; gap: 8px 12px; margin: 0; }
    .spec dt { color: var(--muted); } .spec dd { margin: 0; }
    .stock { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; }
    .big { font-size: 48px; font-weight: 800; color: var(--gold); line-height: 1.1; }
  `,
})
export class ProductDetailPage implements OnInit {
  id = input.required<string>();
  private api = inject(Api);
  private dialog = inject(MatDialog);
  private dialogs = inject(Dialogs);
  private snack = inject(MatSnackBar);
  protected auth = inject(Auth);

  product = signal<Product | null>(null);
  movements = signal<Movement[]>([]);
  error = signal('');

  ngOnInit() { this.load(); }

  load() {
    this.api.product(+this.id()).subscribe({
      next: r => { this.product.set(r.product); this.movements.set(r.movements); },
      error: e => this.error.set(errorMessage(e)),
    });
  }

  edit() {
    this.api.categories().subscribe(categories =>
      this.dialog.open(ProductDialog, { data: { product: this.product(), categories }, width: '720px', direction: 'rtl' })
        .afterClosed().subscribe(saved => { if (saved) this.load(); }));
  }

  async adjust() {
    const p = this.product(); if (!p) return;
    const changeText = await this.dialogs.prompt('اصلاح موجودی',
      'مقدار تغییر (مثلاً ۲ برای افزایش، ‎-۱ برای کاهش)', {
        message: `موجودی فعلی: ${p.stockQuantity}. این تغییر با دلیل و نام شما در تاریخچه ثبت می‌شود.`, inputMode: 'decimal', confirmText: 'ادامه',
      });
    if (changeText === null) return;
    const change = parseNumber(changeText);
    if (!Number.isInteger(change) || change === 0) { this.snack.open('عدد صحیح غیر صفر وارد کنید.', 'باشه'); return; }
    const reason = await this.dialogs.prompt('دلیل اصلاح موجودی', 'دلیل (مثلاً شمارش انبار، خرید جدید، آسیب)', { confirmText: 'ثبت' });
    if (!reason) return;
    try {
      await firstValueFrom(this.api.adjustStock(p.id, change, reason));
      this.snack.open('موجودی اصلاح شد.', 'باشه');
      this.load();
    } catch (e) { this.snack.open(errorMessage(e), 'باشه', { duration: 8000 }); }
  }

  async archive() {
    const p = this.product(); if (!p) return;
    if (!(await this.dialogs.confirm('بایگانی کالا', 'کالای بایگانی‌شده در فروش و جستجوی عادی نمایش داده نمی‌شود، اما سوابق آن حفظ می‌شود.', { confirmText: 'بایگانی' }))) return;
    this.api.archive(p.id).subscribe({ next: x => this.product.set(x), error: e => this.snack.open(errorMessage(e), 'باشه') });
  }

  restore() {
    const p = this.product(); if (!p) return;
    this.api.restore(p.id).subscribe({ next: x => this.product.set(x), error: e => this.snack.open(errorMessage(e), 'باشه') });
  }
}
