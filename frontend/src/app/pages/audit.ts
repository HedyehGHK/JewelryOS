import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Api, AuditRow } from '../core/api';
import { FA_PIPES } from '../core/fa';

const ACTIONS: Record<string, string> = {
  'auth.login': 'ورود', 'auth.login_failed': 'ورود ناموفق', 'user.create': 'ایجاد کاربر', 'user.update': 'ویرایش کاربر',
  'user.reset_password': 'تغییر رمز توسط مدیر', 'user.change_password': 'تغییر رمز',
  'product.create': 'ایجاد کالا', 'product.update': 'ویرایش کالا', 'product.archive': 'بایگانی کالا', 'product.restore': 'بازگردانی کالا',
  'stock.adjust': 'اصلاح موجودی', 'rate.create': 'ثبت نرخ طلا', 'settings.update': 'تغییر تنظیمات',
  'invoice.create': 'صدور فاکتور', 'invoice.void': 'ابطال فاکتور', 'invoice.return': 'مرجوعی', 'invoice.pdf': 'چاپ فاکتور',
  'import.upload': 'بارگذاری اکسل', 'import.commit': 'ثبت اکسل', 'import.discard': 'لغو اکسل', 'backup.download': 'دانلود پشتیبان', 'seed.demo': 'داده نمونه',
};

@Component({
  selector: 'app-audit',
  imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatSelectModule, ...FA_PIPES],
  template: `
  <div class="page">
    <div class="page-head">
      <h1>گزارش فعالیت‌ها</h1>
      <mat-form-field style="width:220px"><mat-label>نوع</mat-label>
        <mat-select [(ngModel)]="filter" (ngModelChange)="page.set(1); load()">
          <mat-option value="">همه</mat-option>
          <mat-option value="invoice.">فاکتورها</mat-option>
          <mat-option value="stock.">موجودی</mat-option>
          <mat-option value="product.">کالاها</mat-option>
          <mat-option value="rate.">نرخ طلا</mat-option>
          <mat-option value="settings.">تنظیمات</mat-option>
          <mat-option value="auth.">ورود و خروج</mat-option>
          <mat-option value="user.">کاربران</mat-option>
          <mat-option value="import.">اکسل</mat-option>
        </mat-select></mat-form-field>
    </div>
    <div class="table-wrap">
      <table class="t">
        <thead><tr><th>زمان</th><th>کاربر</th><th>عملیات</th><th>شرح</th></tr></thead>
        <tbody>
          @for (a of rows(); track a.id) {
            <tr>
              <td class="num small">{{ a.createdAt | faDate }}</td>
              <td>{{ a.actorName }}</td>
              <td><span class="badge" [class.bad]="a.action.includes('void') || a.action.includes('failed')">{{ name(a.action) }}</span></td>
              <td class="small">{{ a.summary || '—' }}</td>
            </tr>
          } @empty { <tr><td colspan="4" class="empty">رویدادی نیست.</td></tr> }
        </tbody>
      </table>
    </div>
    <div class="row" style="justify-content:center;margin-top:10px">
      <button mat-button [disabled]="page() === 1" (click)="page.set(page() - 1); load()">قبلی</button>
      <span class="muted">صفحه {{ page() | faNum }}</span>
      <button mat-button [disabled]="rows().length < 100" (click)="page.set(page() + 1); load()">بعدی</button>
    </div>
  </div>`,
})
export class AuditPage implements OnInit {
  private api = inject(Api);
  rows = signal<AuditRow[]>([]);
  page = signal(1);
  filter = '';
  ngOnInit() { this.load(); }
  load() { this.api.audit(this.page(), this.filter || undefined).subscribe(r => this.rows.set(r)); }
  name(a: string) { return ACTIONS[a] ?? a; }
}
