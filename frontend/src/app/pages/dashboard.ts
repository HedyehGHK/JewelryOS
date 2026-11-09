import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { Api, Dashboard, errorMessage } from '../core/api';
import { Auth } from '../core/auth';
import { FA_PIPES } from '../core/fa';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, FormsModule, MatButtonModule, MatButtonToggleModule, ...FA_PIPES],
  template: `
  <div class="page">
    <div class="page-head">
      <h1>سلام {{ auth.user()?.displayName }}</h1>
      <mat-button-toggle-group [(ngModel)]="days" (ngModelChange)="load()" hideSingleSelectionIndicator>
        <mat-button-toggle [value]="7">۷ روز</mat-button-toggle>
        <mat-button-toggle [value]="30">۳۰ روز</mat-button-toggle>
        <mat-button-toggle [value]="90">۹۰ روز</mat-button-toggle>
      </mat-button-toggle-group>
    </div>
    @if (error()) { <div class="error-box">{{ error() }}</div> }

    @if (d(); as d) {
      @if (!d.currentRate) {
        <div class="error-box">نرخ روز طلا ثبت نشده است. <a routerLink="/rates">ثبت نرخ</a></div>
      } @else if (rateStale()) {
        <div class="info-box">آخرین نرخ طلا مربوط به {{ d.rateUpdatedAt | faDate }} است. <a routerLink="/rates">به‌روزرسانی نرخ</a></div>
      }

      <div class="kpis">
        <div class="kpi"><span>فروش امروز</span><b class="num">{{ d.todaySalesTotal | money }}</b><small>{{ d.todayInvoiceCount | faNum }} فاکتور · {{ d.currency }}</small></div>
        <div class="kpi"><span>فروش {{ d.days | faNum }} روز اخیر</span><b class="num">{{ d.periodSalesTotal | money }}</b><small>{{ d.periodInvoiceCount | faNum }} فاکتور</small></div>
        <div class="kpi"><span>نرخ ۱۸ عیار</span><b class="num">{{ d.currentRate | money }}</b><small>{{ d.rateUpdatedAt | faDate }}</small></div>
        <div class="kpi"><span>موجودی</span><b class="num">{{ d.stockPieces | faNum }} عدد</b><small>معادل {{ d.stockGrams18k | faNum }} گرم ۱۸ عیار</small></div>
        @if (auth.isOwner()) {
          <div class="kpi"><span>ارزش طلای موجودی</span><b class="num">{{ d.stockGoldValue | money }}</b><small>بدون اجرت و سود</small></div>
        }
      </div>

      <div class="grid-2">
        <div class="card">
          <h2>فروش روزانه</h2>
          @if (d.salesByDay.length) {
            <div class="bars">
              @for (s of d.salesByDay; track s.date; let i = $index, n = $count) {
                <div class="bar-col" [title]="(s.date | faDate:'short') + ': ' + (s.total | money) + ' — ' + (s.count | faNum) + ' فاکتور'">
                  <div class="bar" [style.height.%]="pct(s.total, maxDay())"></div>
                  <span class="lbl">{{ n <= 10 || i % Math.ceil(n / 7) === 0 ? (s.date | faDate:'short') : '' }}</span>
                </div>
              }
            </div>
          } @else { <div class="empty">در این بازه فروشی ثبت نشده است.</div> }
        </div>
        <div class="card">
          <h2>فروش بر اساس دسته</h2>
          @for (c of d.salesByCategory; track c.category) {
            <div class="hbar">
              <span class="name">{{ c.category }}</span>
              <div class="track"><div class="fill" [style.width.%]="pct(c.total, maxCat())"></div></div>
              <span class="num val">{{ c.total | money }}</span>
            </div>
          } @empty { <div class="empty">داده‌ای نیست.</div> }
        </div>
        <div class="card">
          <h2>موجودی بر اساس دسته</h2>
          <table class="t">
            <thead><tr><th>دسته</th><th>تعداد</th><th>وزن (گرم)</th></tr></thead>
            <tbody>
              @for (c of d.stockByCategory; track c.category) {
                <tr><td>{{ c.category }}</td><td class="num">{{ c.pieces | faNum }}</td><td class="num">{{ c.grams | faNum }}</td></tr>
              }
            </tbody>
          </table>
        </div>
        <div class="card">
          <h2>هشدار موجودی کم</h2>
          @for (p of d.lowStock; track p.id) {
            <a class="low" [routerLink]="['/products', p.id]"><span class="num">{{ p.sku }}</span> {{ p.name }}
              <span class="badge" [class.bad]="p.stockQuantity === 0" [class.warn]="p.stockQuantity > 0">{{ p.stockQuantity | faNum }}</span></a>
          } @empty { <div class="empty">مورد هشداری نیست.</div> }
          <p class="muted small">کالاهای فعال با موجودی کمتر یا مساوی حد تعیین‌شده در تنظیمات (پیش‌فرض ۰ = فقط کالاهای تمام‌شده).</p>
        </div>
      </div>
    }
  </div>`,
  styles: `
    .kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 12px; margin-bottom: 16px; }
    .kpi { background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 14px 16px; display: flex; flex-direction: column; gap: 4px; }
    .kpi span { color: var(--muted); font-size: 13px; } .kpi b { font-size: 22px; } .kpi small { color: var(--muted); }
    .bars { display: flex; align-items: flex-end; gap: 3px; height: 180px; padding-top: 8px; }
    .bar-col { flex: 1 1 0; min-width: 3px; height: 100%; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; gap: 4px; }
    .bar { width: 100%; max-width: 28px; background: var(--gold); border-radius: 4px 4px 0 0; min-height: 2px; }
    .lbl { font-size: 10px; color: var(--muted); white-space: nowrap; }
    .hbar { display: grid; grid-template-columns: 110px 1fr auto; gap: 10px; align-items: center; margin: 8px 0; }
    .track { background: #f3ede3; border-radius: 6px; height: 12px; overflow: hidden; } .fill { background: var(--gold); height: 100%; border-radius: 6px; }
    .val { font-size: 13px; }
    .low { display: flex; gap: 8px; align-items: center; padding: 8px 4px; border-bottom: 1px solid var(--line); color: inherit; text-decoration: none; }
    .low .badge { margin-inline-start: auto; }
  `,
})
export class DashboardPage implements OnInit {
  private api = inject(Api);
  protected auth = inject(Auth);
  protected Math = Math;
  days = 30;
  d = signal<Dashboard | null>(null);
  error = signal('');
  maxDay = computed(() => Math.max(1, ...(this.d()?.salesByDay.map(s => s.total) ?? [1])));
  maxCat = computed(() => Math.max(1, ...(this.d()?.salesByCategory.map(s => s.total) ?? [1])));
  rateStale = computed(() => {
    const t = this.d()?.rateUpdatedAt;
    if (!t) return false;
    return Date.now() - new Date(t.endsWith('Z') ? t : t + 'Z').getTime() > 20 * 3600 * 1000;
  });

  ngOnInit() { this.load(); }
  load() { this.api.dashboard(this.days).subscribe({ next: d => { this.d.set(d); this.error.set(''); }, error: e => this.error.set(errorMessage(e)) }); }
  pct(v: number, max: number) { return Math.max(1, (v / max) * 100); }
}
