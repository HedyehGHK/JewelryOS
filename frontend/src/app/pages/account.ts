import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { Api, errorMessage } from '../core/api';
import { Auth } from '../core/auth';

@Component({
  selector: 'app-account',
  imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  template: `
  <div class="page">
    <div class="page-head"><h1>تغییر رمز عبور</h1></div>
    <div class="card" style="max-width:440px">
      <mat-form-field><mat-label>رمز فعلی</mat-label><input matInput type="password" [(ngModel)]="current" autocomplete="current-password" dir="ltr"></mat-form-field>
      <mat-form-field><mat-label>رمز جدید (حداقل ۸ کاراکتر)</mat-label><input matInput type="password" [(ngModel)]="next" autocomplete="new-password" dir="ltr"></mat-form-field>
      <mat-form-field><mat-label>تکرار رمز جدید</mat-label><input matInput type="password" [(ngModel)]="repeat" autocomplete="new-password" dir="ltr"></mat-form-field>
      @if (error()) { <div class="error-box">{{ error() }}</div> }
      <button mat-flat-button class="big-btn" (click)="save()">ذخیره</button>
    </div>
  </div>`,
})
export class AccountPage {
  private api = inject(Api);
  private auth = inject(Auth);
  private router = inject(Router);
  private snack = inject(MatSnackBar);
  current = ''; next = ''; repeat = '';
  error = signal('');

  async save() {
    if (this.next.length < 8) { this.error.set('رمز جدید باید حداقل ۸ کاراکتر باشد.'); return; }
    if (this.next !== this.repeat) { this.error.set('تکرار رمز با رمز جدید یکسان نیست.'); return; }
    try {
      this.auth.user.set(await firstValueFrom(this.api.changePassword(this.current, this.next)));
      this.snack.open('رمز عبور تغییر کرد.', 'باشه');
      this.router.navigateByUrl('/');
    } catch (e) { this.error.set(errorMessage(e)); }
  }
}
