import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { Api, Role, UserRow, errorMessage } from '../core/api';
import { Auth } from '../core/auth';
import { Dialogs } from '../core/dialogs';
import { FA_PIPES } from '../core/fa';

@Component({
  selector: 'app-users',
  imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, ...FA_PIPES],
  template: `
  <div class="page">
    <div class="page-head"><h1>کاربران</h1></div>
    <div class="card">
      <h2>کاربر جدید</h2>
      <div class="form-grid">
        <mat-form-field><mat-label>نام کاربری (انگلیسی)</mat-label><input matInput [(ngModel)]="username" dir="ltr"></mat-form-field>
        <mat-form-field><mat-label>نام نمایشی</mat-label><input matInput [(ngModel)]="displayName"></mat-form-field>
        <mat-form-field><mat-label>رمز موقت (حداقل ۸ کاراکتر)</mat-label><input matInput [(ngModel)]="password" dir="ltr" type="password" autocomplete="new-password"></mat-form-field>
        <mat-form-field><mat-label>نقش</mat-label>
          <mat-select [(ngModel)]="role"><mat-option value="Seller">فروشنده</mat-option><mat-option value="Owner">مدیر</mat-option></mat-select></mat-form-field>
      </div>
      <button mat-flat-button (click)="create()">افزودن کاربر</button>
      <p class="muted small">فروشنده: فروش، مشاهده کالا و فاکتور. مدیر: همه کارها شامل نرخ طلا، ابطال، اصلاح موجودی، ورود اکسل و تنظیمات.</p>
    </div>
    <div class="card">
      <div class="table-wrap">
        <table class="t">
          <thead><tr><th>نام کاربری</th><th>نام</th><th>نقش</th><th>وضعیت</th><th></th></tr></thead>
          <tbody>
            @for (u of users(); track u.id) {
              <tr>
                <td class="num" dir="ltr" style="text-align:right">{{ u.username }}</td>
                <td>{{ u.displayName }}</td>
                <td>{{ u.role | label }}</td>
                <td><span class="badge" [class.ok]="u.isActive" [class.bad]="!u.isActive">{{ u.isActive ? 'فعال' : 'غیرفعال' }}</span></td>
                <td class="end">
                  @if (u.id !== auth.user()?.id) {
                    <button mat-button (click)="toggleRole(u)">{{ u.role === 'Owner' ? 'تبدیل به فروشنده' : 'تبدیل به مدیر' }}</button>
                    <button mat-button (click)="toggleActive(u)">{{ u.isActive ? 'غیرفعال کردن' : 'فعال کردن' }}</button>
                  }
                  <button mat-button (click)="reset(u)">رمز جدید</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  </div>`,
})
export class UsersPage implements OnInit {
  private api = inject(Api);
  private snack = inject(MatSnackBar);
  private dialogs = inject(Dialogs);
  protected auth = inject(Auth);
  users = signal<UserRow[]>([]);
  username = ''; displayName = ''; password = ''; role: Role = 'Seller';

  ngOnInit() { this.load(); }
  load() { this.api.users().subscribe(u => this.users.set(u)); }

  private async run(op: Promise<unknown>, ok: string) {
    try { await op; this.snack.open(ok, 'باشه'); this.load(); } catch (e) { this.snack.open(errorMessage(e), 'باشه', { duration: 7000 }); }
  }

  async create() {
    await this.run(firstValueFrom(this.api.createUser({ username: this.username, displayName: this.displayName, password: this.password, role: this.role })), 'کاربر ساخته شد. در اولین ورود باید رمزش را عوض کند.');
    this.username = this.displayName = this.password = '';
  }
  toggleRole(u: UserRow) { this.run(firstValueFrom(this.api.updateUser(u.id, { displayName: u.displayName, role: u.role === 'Owner' ? 'Seller' : 'Owner', isActive: u.isActive })), 'نقش تغییر کرد.'); }
  toggleActive(u: UserRow) { this.run(firstValueFrom(this.api.updateUser(u.id, { displayName: u.displayName, role: u.role, isActive: !u.isActive })), 'وضعیت تغییر کرد.'); }
  async reset(u: UserRow) {
    const pw = await this.dialogs.prompt(`رمز جدید برای ${u.displayName}`, 'رمز موقت (حداقل ۸ کاراکتر)', { confirmText: 'ثبت' });
    if (pw) this.run(firstValueFrom(this.api.resetPassword(u.id, pw)), 'رمز تغییر کرد.');
  }
}
