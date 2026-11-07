import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Subject, debounceTime } from 'rxjs';
import { Api, InvoiceStatus, InvoiceSummary, errorMessage } from '../core/api';
import { FA_PIPES } from '../core/fa';

@Component({
  selector: 'app-invoices',
  imports: [FormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, ...FA_PIPES],
  template: `
  <div class="page">
    <div class="page-head">
      <h1>فاکتورها</h1>
      <a mat-flat-button routerLink="/sale"><span class="material-symbols-outlined">add</span> فروش جدید</a>
    </div>
    <div class="card" style="margin-bottom:14px">
      <div class="row">
        <mat-form-field class="grow"><mat-label>شماره فاکتور، نام یا تلفن خریدار، کد کالا</mat-label>
          <input matInput [(ngModel)]="q" (ngModelChange)="reload$.next()"></mat-form-field>
        <mat-form-field style="width:170px"><mat-label>وضعیت</mat-label>
          <mat-select [(ngModel)]="status" (ngModelChange)="page.set(1); load()">
            <mat-option value="">همه</mat-option>
            <mat-option value="Issued">صادر شده</mat-option>
            <mat-option value="Voided">باطل شده</mat-option>
            <mat-option value="Returned">مرجوع شده</mat-option>
          </mat-select></mat-form-field>
      </div>
    </div>
    @if (error()) { <div class="error-box">{{ error() }}</div> }
    <div class="table-wrap">
      <table class="t">
        <thead><tr><th>شماره</th><th>تاریخ</th><th>خریدار</th><th class="hide-sm">فروشنده</th><th class="hide-sm">اقلام</th><th>وضعیت</th><th class="end">مبلغ</th></tr></thead>
        <tbody>
          @for (i of items(); track i.id) {
            <tr class="clickable" (click)="router.navigate(['/invoices', i.id])">
              <td class="num"><b>{{ i.number | faNum }}</b></td>
              <td class="num small">{{ i.createdAt | faDate }}</td>
              <td>{{ i.customerName || '—' }}</td>
              <td class="hide-sm">{{ i.sellerName }}</td>
              <td class="hide-sm num">{{ i.lineCount | faNum }}</td>
              <td><span class="badge" [class.ok]="i.status === 'Issued'" [class.bad]="i.status !== 'Issued'">{{ i.status | label }}</span></td>
              <td class="end num">{{ i.grandTotal | money }}</td>
            </tr>
          } @empty { <tr><td colspan="7" class="empty">فاکتوری پیدا نشد.</td></tr> }
        </tbody>
      </table>
    </div>
    <div class="row pager">
      <button mat-button [disabled]="page() === 1" (click)="page.set(page() - 1); load()">صفحه قبل</button>
      <span class="muted">صفحه {{ page() | faNum }}</span>
      <button mat-button [disabled]="items().length < 50" (click)="page.set(page() + 1); load()">صفحه بعد</button>
    </div>
  </div>`,
  styles: `.pager { justify-content: center; margin-top: 10px; }`,
})
export class InvoicesPage implements OnInit {
  private api = inject(Api);
  protected router = inject(Router);
  q = ''; status: InvoiceStatus | '' = '';
  page = signal(1);
  reload$ = new Subject<void>();
  items = signal<InvoiceSummary[]>([]);
  error = signal('');

  ngOnInit() {
    this.reload$.pipe(debounceTime(250)).subscribe(() => { this.page.set(1); this.load(); });
    this.load();
  }

  load() {
    this.api.invoices({ q: this.q, status: this.status, page: this.page() }).subscribe({
      next: r => { this.items.set(r); this.error.set(''); },
      error: e => this.error.set(errorMessage(e)),
    });
  }
}
