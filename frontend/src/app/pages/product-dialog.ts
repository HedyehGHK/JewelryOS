import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { firstValueFrom } from 'rxjs';
import { Api, Product, TrackingMode, errorMessage } from '../core/api';
import { parseNumber } from '../core/fa';

@Component({
  selector: 'app-product-dialog',
  imports: [FormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatAutocompleteModule],
  template: `
  <h2 mat-dialog-title>{{ data.product ? 'ویرایش کالا' : 'کالای جدید' }}</h2>
  <mat-dialog-content>
    <div class="form-grid">
      <mat-form-field><mat-label>کد کالا (SKU)</mat-label><input matInput [(ngModel)]="sku" dir="ltr" maxlength="64" required></mat-form-field>
      <mat-form-field><mat-label>نام کالا</mat-label><input matInput [(ngModel)]="name" maxlength="200" required></mat-form-field>
      <mat-form-field>
        <mat-label>دسته‌بندی</mat-label>
        <input matInput [(ngModel)]="category" [matAutocomplete]="cats" maxlength="100">
        <mat-autocomplete #cats="matAutocomplete">
          @for (c of data.categories; track c) { <mat-option [value]="c">{{ c }}</mat-option> }
        </mat-autocomplete>
      </mat-form-field>
      <mat-form-field>
        <mat-label>عیار (هزارم)</mat-label>
        <mat-select [(ngModel)]="purity">
          <mat-option [value]="750">۷۵۰ — ۱۸ عیار</mat-option>
          <mat-option [value]="875">۸۷۵ — ۲۱ عیار</mat-option>
          <mat-option [value]="900">۹۰۰ — سکه</mat-option>
          <mat-option [value]="995">۹۹۵ — آب‌شده</mat-option>
          <mat-option [value]="999">۹۹۹ — ۲۴ عیار</mat-option>
          <mat-option [value]="585">۵۸۵ — ۱۴ عیار</mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field><mat-label>وزن (گرم)</mat-label><input matInput [(ngModel)]="weight" inputmode="decimal" dir="ltr" required></mat-form-field>
      <mat-form-field><mat-label>اجرت (درصد از ارزش طلا)</mat-label><input matInput [(ngModel)]="wage" inputmode="decimal" dir="ltr"></mat-form-field>
      <mat-form-field><mat-label>ارزش سنگ و اضافات (هر عدد)</mat-label><input matInput [(ngModel)]="stone" inputmode="numeric" dir="ltr"></mat-form-field>
      <mat-form-field>
        <mat-label>نوع ردیابی</mat-label>
        <mat-select [(ngModel)]="tracking">
          <mat-option value="Unique">تکی (هر قطعه منحصربه‌فرد)</mat-option>
          <mat-option value="Quantity">تعدادی (چند عدد مشابه)</mat-option>
        </mat-select>
      </mat-form-field>
      @if (!data.product) {
        <mat-form-field><mat-label>موجودی اولیه</mat-label><input matInput [(ngModel)]="initialStock" inputmode="numeric" dir="ltr"></mat-form-field>
      }
      <mat-form-field class="full"><mat-label>توضیحات</mat-label><textarea matInput [(ngModel)]="notes" rows="2"></textarea></mat-form-field>
    </div>
    @if (data.product) { <div class="muted small">برای تغییر موجودی از دکمه «اصلاح موجودی» استفاده کنید تا در تاریخچه ثبت شود.</div> }
    @if (error()) { <div class="error-box">{{ error() }}</div> }
  </mat-dialog-content>
  <mat-dialog-actions align="end">
    <button mat-button mat-dialog-close>انصراف</button>
    <button mat-flat-button (click)="save()" [disabled]="busy()">ذخیره</button>
  </mat-dialog-actions>`,
})
export class ProductDialog {
  data = inject<{ product: Product | null; categories: string[] }>(MAT_DIALOG_DATA);
  private ref = inject(MatDialogRef<ProductDialog, Product>);
  private api = inject(Api);
  busy = signal(false);
  error = signal('');

  private p = this.data.product;
  sku = this.p?.sku ?? '';
  name = this.p?.name ?? '';
  category = this.p?.category ?? '';
  purity = this.p?.purity ?? 750;
  weight = this.p ? String(this.p.weightGrams) : '';
  wage = this.p ? String(this.p.wagePercent) : '';
  stone = this.p ? String(this.p.stoneValue) : '0';
  tracking: TrackingMode = this.p?.trackingMode ?? 'Unique';
  initialStock = '1';
  notes = this.p?.notes ?? '';

  async save() {
    const weightGrams = parseNumber(this.weight), wagePercent = parseNumber(this.wage || '0'), stoneValue = parseNumber(this.stone || '0');
    const initialStock = parseNumber(this.initialStock || '0');
    if (!Number.isFinite(weightGrams) || weightGrams <= 0) { this.error.set('وزن را درست وارد کنید (مثلاً ۳٫۲۵).'); return; }
    if (!Number.isFinite(wagePercent) || !Number.isFinite(stoneValue)) { this.error.set('اجرت و ارزش سنگ باید عدد باشند.'); return; }
    if (!this.data.product && (!Number.isInteger(initialStock) || initialStock < 0)) { this.error.set('موجودی اولیه باید عدد صحیح باشد.'); return; }

    const body = {
      sku: this.sku, name: this.name, category: this.category, purity: this.purity, weightGrams, wagePercent, stoneValue,
      trackingMode: this.tracking, notes: this.notes, initialStock,
    };
    this.busy.set(true); this.error.set('');
    try {
      const saved = this.data.product
        ? await firstValueFrom(this.api.updateProduct(this.data.product.id, body))
        : await firstValueFrom(this.api.createProduct(body));
      this.ref.close(saved);
    } catch (e) {
      this.error.set(errorMessage(e));
    } finally {
      this.busy.set(false);
    }
  }
}
