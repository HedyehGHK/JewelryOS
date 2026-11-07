import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { Api, Settings, errorMessage } from '../core/api';
import { FA_PIPES, parseNumber } from '../core/fa';

@Component({
  selector: 'app-settings',
  imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, ...FA_PIPES],
  template: `
  <div class="page">
    <div class="page-head"><h1>تنظیمات</h1></div>
    @if (s(); as s) {
      <div class="card">
        <h2>فرمول قیمت‌گذاری</h2>
        <div class="info-box small">
          ارزش طلا = وزن × نرخ ۱۸ عیار × عیار ÷ ۷۵۰ ·
          اجرت = ارزش طلا × درصد اجرت کالا ·
          سود = (طلا + اجرت) × {{ profit() | faNum }}٪ ·
          مالیات = {{ s.taxBase === 'WholePrice' ? '(کل مبلغ)' : '(اجرت + سود + سنگ)' }} × {{ tax() | faNum }}٪
        </div>
        <div class="form-grid">
          <mat-form-field><mat-label>درصد سود فروشنده</mat-label><input matInput [(ngModel)]="profitText" inputmode="decimal" dir="ltr"></mat-form-field>
          <mat-form-field><mat-label>درصد مالیات بر ارزش افزوده</mat-label><input matInput [(ngModel)]="taxText" inputmode="decimal" dir="ltr"></mat-form-field>
          <mat-form-field><mat-label>مالیات روی</mat-label>
            <mat-select [(ngModel)]="s.taxBase">
              <mat-option value="WageAndProfit">فقط اجرت و سود (و سنگ) — رایج</mat-option>
              <mat-option value="WholePrice">کل مبلغ فاکتور</mat-option>
            </mat-select></mat-form-field>
          <mat-form-field><mat-label>گرد کردن جمع فاکتور به مضرب</mat-label><input matInput [(ngModel)]="roundText" inputmode="numeric" dir="ltr"></mat-form-field>
        </div>
        <p class="muted small">این عددها را با صاحب مغازه و قوانین روز (اتحادیه و سازمان امور مالیاتی) تطبیق دهید. تغییرات فقط روی فاکتورهای بعدی اثر دارد و در گزارش فعالیت‌ها ثبت می‌شود.</p>
      </div>
      <div class="card">
        <h2>اطلاعات فروشگاه (سربرگ فاکتور)</h2>
        <div class="form-grid">
          <mat-form-field><mat-label>نام فروشگاه</mat-label><input matInput [(ngModel)]="s.storeName"></mat-form-field>
          <mat-form-field><mat-label>تلفن</mat-label><input matInput [(ngModel)]="s.phone" dir="ltr"></mat-form-field>
          <mat-form-field><mat-label>واحد پول</mat-label><input matInput [(ngModel)]="s.currencyLabel"></mat-form-field>
          <mat-form-field><mat-label>حد هشدار موجودی کم</mat-label><input matInput [(ngModel)]="lowText" inputmode="numeric" dir="ltr"></mat-form-field>
          <mat-form-field class="full"><mat-label>نشانی</mat-label><input matInput [(ngModel)]="s.address"></mat-form-field>
          <mat-form-field class="full"><mat-label>متن پایین فاکتور</mat-label><input matInput [(ngModel)]="s.invoiceFooter"></mat-form-field>
        </div>
      </div>
      @if (sys(); as x) {
        <div class="card">
          <h2>استفاده از موبایل و کامپیوترهای دیگر مغازه</h2>
          <p class="muted small">وقتی برنامه روی این کامپیوتر باز است، دستگاه‌هایی که به همین مودم وصل‌اند می‌توانند یکی از این آدرس‌ها را در مرورگر باز کنند:</p>
          @for (a of x.addresses; track a) { <div class="addr ltr num">{{ a }}</div> }
          @empty { <div class="muted">شبکه‌ای پیدا نشد.</div> }
          <p class="muted small">محل فایل اطلاعات: <span class="ltr">{{ x.databaseFile }}</span> · نسخه {{ x.version }}</p>
        </div>
      }
      <div class="row" style="margin-top:16px">
        <button mat-flat-button class="big-btn" (click)="save()">ذخیره تنظیمات</button>
        <a mat-stroked-button [href]="api.backupUrl()"><span class="material-symbols-outlined">backup</span> دانلود نسخه پشتیبان</a>
      </div>
    }
  </div>`,
  styles: `.addr { font-size: 18px; font-weight: 700; color: var(--gold); padding: 6px 0; user-select: all; text-align: right; }`,
})
export class SettingsPage implements OnInit {
  protected api = inject(Api);
  private snack = inject(MatSnackBar);
  s = signal<Settings | null>(null);
  sys = signal<{ addresses: string[]; databaseFile: string; version: string } | null>(null);
  profitText = ''; taxText = ''; roundText = ''; lowText = '';
  profit() { return parseNumber(this.profitText); }
  tax() { return parseNumber(this.taxText); }

  ngOnInit() {
    this.api.system().subscribe({ next: x => this.sys.set(x), error: () => {} });
    this.api.settings().subscribe(s => {
      this.profitText = String(s.profitPercent); this.taxText = String(s.taxPercent);
      this.roundText = String(s.roundingUnit); this.lowText = String(s.lowStockThreshold);
      this.s.set(s);
    });
  }

  async save() {
    const s = this.s(); if (!s) return;
    const body: Settings = {
      ...s, profitPercent: parseNumber(this.profitText), taxPercent: parseNumber(this.taxText),
      roundingUnit: parseNumber(this.roundText || '0'), lowStockThreshold: Math.floor(parseNumber(this.lowText || '0')),
    };
    if ([body.profitPercent, body.taxPercent, body.roundingUnit, body.lowStockThreshold].some(v => !Number.isFinite(v))) {
      this.snack.open('همه درصدها و اعداد را درست وارد کنید.', 'باشه'); return;
    }
    try {
      this.s.set(await firstValueFrom(this.api.saveSettings(body)));
      this.snack.open('تنظیمات ذخیره شد.', 'باشه');
    } catch (e) { this.snack.open(errorMessage(e), 'باشه'); }
  }
}
