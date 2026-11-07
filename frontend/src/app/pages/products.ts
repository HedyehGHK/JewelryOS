import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Subject, debounceTime } from 'rxjs';
import { Api, Product, ProductStatus, errorMessage } from '../core/api';
import { Auth } from '../core/auth';
import { FA_PIPES } from '../core/fa';
import { ProductDialog } from './product-dialog';

@Component({
  selector: 'app-products',
  imports: [FormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatProgressBarModule, ...FA_PIPES],
  template: `
  <div class="page">
    <div class="page-head">
      <h1>کالاها و موجودی</h1>
      @if (auth.isOwner()) {
        <a mat-stroked-button routerLink="/import"><span class="material-symbols-outlined">upload_file</span> ورود از اکسل</a>
        <button mat-flat-button (click)="openDialog(null)"><span class="material-symbols-outlined">add</span> کالای جدید</button>
      }
    </div>

    <div class="card filters">
      <div class="row">
        <mat-form-field class="grow"><mat-label>جستجو (کد، نام، دسته)</mat-label>
          <input matInput [(ngModel)]="q" (ngModelChange)="reload$.next()"></mat-form-field>
        <mat-form-field style="width:180px"><mat-label>دسته‌بندی</mat-label>
          <mat-select [(ngModel)]="category" (ngModelChange)="load()">
            <mat-option value="">همه</mat-option>
            @for (c of categories(); track c) { <mat-option [value]="c">{{ c }}</mat-option> }
          </mat-select></mat-form-field>
        <mat-form-field style="width:150px"><mat-label>موجودی</mat-label>
          <mat-select [(ngModel)]="stock" (ngModelChange)="load()">
            <mat-option value="">همه</mat-option><mat-option value="in">موجود</mat-option><mat-option value="out">ناموجود</mat-option>
          </mat-select></mat-form-field>
        <mat-form-field style="width:150px"><mat-label>وضعیت</mat-label>
          <mat-select [(ngModel)]="status" (ngModelChange)="load()">
            <mat-option value="Active">فعال</mat-option><mat-option value="Archived">بایگانی</mat-option>
          </mat-select></mat-form-field>
      </div>
      <div class="muted small">{{ items().length | faNum }} کالا · {{ totalPieces() | faNum }} عدد · {{ totalGrams() | faNum }} گرم</div>
    </div>

    @if (loading()) { <mat-progress-bar mode="indeterminate" /> }
    @if (error()) { <div class="error-box">{{ error() }}</div> }

    <div class="table-wrap">
      <table class="t">
        <thead><tr>
          <th>کد</th><th>نام</th><th class="hide-sm">دسته</th><th>عیار</th><th>وزن (گرم)</th><th class="hide-sm">اجرت ٪</th>
          <th class="hide-sm">نوع</th><th>موجودی</th>
        </tr></thead>
        <tbody>
          @for (p of items(); track p.id) {
            <tr class="clickable" (click)="router.navigate(['/products', p.id])">
              <td class="num"><b>{{ p.sku }}</b></td>
              <td>{{ p.name }}</td>
              <td class="hide-sm">{{ p.category || '—' }}</td>
              <td class="num">{{ p.purity | faNum }}</td>
              <td class="num">{{ p.weightGrams | faNum }}</td>
              <td class="num hide-sm">{{ p.wagePercent | faNum }}</td>
              <td class="hide-sm">{{ p.trackingMode | label }}</td>
              <td>
                @if (p.stockQuantity > 0) { <span class="badge ok">{{ p.stockQuantity | faNum }}</span> }
                @else { <span class="badge bad">ناموجود</span> }
              </td>
            </tr>
          } @empty {
            @if (!loading()) { <tr><td colspan="8" class="empty">کالایی پیدا نشد.</td></tr> }
          }
        </tbody>
      </table>
    </div>
  </div>`,
  styles: `.filters { margin-bottom: 14px; }`,
})
export class ProductsPage implements OnInit {
  private api = inject(Api);
  private dialog = inject(MatDialog);
  protected router = inject(Router);
  protected auth = inject(Auth);

  q = ''; category = ''; stock = ''; status: ProductStatus = 'Active';
  reload$ = new Subject<void>();
  items = signal<Product[]>([]);
  categories = signal<string[]>([]);
  loading = signal(false);
  error = signal('');
  totalPieces = computed(() => this.items().reduce((s, p) => s + p.stockQuantity, 0));
  totalGrams = computed(() => Math.round(this.items().reduce((s, p) => s + p.stockQuantity * p.weightGrams, 0) * 1000) / 1000);

  ngOnInit() {
    this.reload$.pipe(debounceTime(250)).subscribe(() => this.load());
    this.load();
    this.api.categories().subscribe(c => this.categories.set(c));
  }

  load() {
    this.loading.set(true);
    this.api.products({ q: this.q, category: this.category, status: this.status, inStock: this.stock === 'in' ? true : this.stock === 'out' ? false : null })
      .subscribe({
        next: r => { this.items.set(r); this.loading.set(false); this.error.set(''); },
        error: e => { this.error.set(errorMessage(e)); this.loading.set(false); },
      });
  }

  openDialog(product: Product | null) {
    this.dialog.open(ProductDialog, { data: { product, categories: this.categories() }, width: '720px', direction: 'rtl' })
      .afterClosed().subscribe(saved => {
        if (saved) { this.load(); this.api.categories().subscribe(c => this.categories.set(c)); }
      });
  }
}
