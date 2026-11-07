import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Auth } from '../core/auth';
import { errorMessage } from '../core/api';

@Component({
  selector: 'app-login',
  imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  template: `
  <div class="wrap">
    <form class="card box" (ngSubmit)="submit()">
      <div class="logo"><span class="material-symbols-outlined">diamond</span></div>
      <h1>ورود به JewelryOS</h1>
      <p class="muted">سامانه موجودی و فاکتور طلافروشی</p>
      <mat-form-field>
        <mat-label>نام کاربری</mat-label>
        <input matInput name="u" [(ngModel)]="username" autocomplete="username" dir="ltr" required autofocus>
      </mat-form-field>
      <mat-form-field>
        <mat-label>رمز عبور</mat-label>
        <input matInput name="p" [(ngModel)]="password" type="password" autocomplete="current-password" dir="ltr" required>
      </mat-form-field>
      @if (error()) { <div class="error-box">{{ error() }}</div> }
      <button mat-flat-button class="big-btn" type="submit" [disabled]="busy()">{{ busy() ? 'در حال ورود…' : 'ورود' }}</button>
    </form>
  </div>`,
  styles: `
    .wrap { min-height: 100vh; display: grid; place-items: center; padding: 16px; background: linear-gradient(160deg, #2b2118, #4a3520); }
    .box { width: min(380px, 100%); display: flex; flex-direction: column; gap: 10px; padding: 28px; }
    .logo { width: 56px; height: 56px; border-radius: 16px; background: var(--gold-soft); color: var(--gold); display: grid; place-items: center; }
    .logo span { font-size: 32px; }
    h1 { margin: 6px 0 0; font-size: 22px; }
    p { margin: 0 0 8px; }
    button { margin-top: 6px; }
  `,
})
export class LoginPage {
  private auth = inject(Auth);
  private router = inject(Router);
  username = '';
  password = '';
  busy = signal(false);
  error = signal('');

  async submit() {
    if (!this.username || !this.password) { this.error.set('نام کاربری و رمز عبور را وارد کنید.'); return; }
    this.busy.set(true); this.error.set('');
    try {
      const me = await this.auth.login(this.username, this.password);
      this.router.navigateByUrl(me.mustChangePassword ? '/account' : '/');
    } catch (e) {
      this.error.set(errorMessage(e));
    } finally {
      this.busy.set(false);
    }
  }
}
