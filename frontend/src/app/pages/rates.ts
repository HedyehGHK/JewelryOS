import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { Api, PriceRate, errorMessage } from '../core/api';
import { Auth } from '../core/auth';
import { Dialogs } from '../core/dialogs';
import { FA_PIPES, faMoney, groupDigits, parseNumber } from '../core/fa';

@Component({
  selector: 'app-rates',
  imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, ...FA_PIPES],
  template: `
  <div class="page">
    <div class="page-head"><h1>نرخ روز طلا</h1></div>
    <div class="grid-2">
      <div class="card">
        <h2>نرخ فعلی (هر گرم طلای ۱۸ عیار)</h2>
        @if (current(); as c) {
          <div class="big num">{{ c.pricePerGram18k | money }} <span class="unit">{{ currency() }}</span></div>
          <div class="muted">ثبت: {{ c.effectiveAt | faDate }} توسط {{ c.createdByName }} @if (c.source) { — منبع: {{ c.source }} }</div>
        } @else { <div class="error-box">هنوز نرخی ثبت نشده است. بدون نرخ روز، فروش ممکن نیست.</div> }
      </div>
      @if (auth.isOwner()) {
        <div class="card">
          <h2>ثبت نرخ جدید</h2>
          <mat-form-field>
            <mat-label>قیمت هر گرم ۱۸ عیار ({{ currency() }})</mat-label>
            <input matInput [(ngModel)]="price" (blur)="price = groupDigits(price)" inputmode="numeric" dir="ltr">
          </mat-form-field>
          <mat-form-field><mat-label>منبع (اختیاری)</mat-label><input matInput [(ngModel)]="source" placeholder="مثلاً اتحادیه طلا"></mat-form-field>
          <button mat-flat-button class="big-btn" (click)="save()" [disabled]="busy()">ثبت نرخ</button>
          <p class="muted small">نرخ جدید فقط روی فاکتورهای بعدی اعمال می‌شود؛ فاکتورهای قبلی با نرخ زمان خودشان ثابت می‌مانند.</p>
        </div>
      }
    </div>
    <div class="card">
      <h2>سابقه نرخ‌ها</h2>
      <div class="table-wrap">
        <table class="t">
          <thead><tr><th>زمان</th><th class="end">نرخ ۱۸ عیار</th><th>منبع</th><th>ثبت‌کننده</th></tr></thead>
          <tbody>
            @for (r of history(); track r.id) {
              <tr><td class="num">{{ r.effectiveAt | faDate }}</td><td class="end num">{{ r.pricePerGram18k | money }}</td><td>{{ r.source || '—' }}</td><td>{{ r.createdByName }}</td></tr>
            } @empty { <tr><td colspan="4" class="empty">بدون سابقه</td></tr> }
          </tbody>
        </table>
      </div>
    </div>
  </div>`,
  styles: `.big { font-size: 34px; font-weight: 800; color: var(--gold); margin: 6px 0; } .unit { font-size: 16px; color: var(--muted); font-weight: 400; }`,
})
export class RatesPage implements OnInit {
  private api = inject(Api);
  private snack = inject(MatSnackBar);
  private dialogs = inject(Dialogs);
  protected auth = inject(Auth);
  protected groupDigits = groupDigits;
  price = ''; source = '';
  current = signal<PriceRate | null>(null);
  history = signal<PriceRate[]>([]);
  currency = signal('تومان');
  busy = signal(false);

  ngOnInit() {
    this.load();
    this.api.settings().subscribe(s => this.currency.set(s.currencyLabel));
  }

  load() { this.api.rates().subscribe(r => { this.current.set(r.current); this.history.set(r.history); }); }

  async save() {
    const v = parseNumber(this.price);
    if (!Number.isFinite(v) || v <= 0) { this.snack.open('نرخ را به صورت عدد وارد کنید.', 'باشه'); return; }
    const prev = this.current()?.pricePerGram18k;
    if (prev && Math.abs(v - prev) / prev > 0.15 &&
        !(await this.dialogs.confirm('تغییر بزرگ نرخ', `نرخ جدید ${faMoney(v)} بیش از ۱۵٪ با نرخ قبلی (${faMoney(prev)}) فرق دارد. مطمئن هستید؟`))) return;
    this.busy.set(true);
    try {
      await firstValueFrom(this.api.addRate(v, this.source));
      this.price = ''; this.source = '';
      this.snack.open('نرخ جدید ثبت شد.', 'باشه');
      this.load();
    } catch (e) { this.snack.open(errorMessage(e), 'باشه'); }
    finally { this.busy.set(false); }
  }
}
