import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { Api, ImportBatchRow, ImportPreview, errorMessage } from '../core/api';
import { Dialogs } from '../core/dialogs';
import { FA_PIPES } from '../core/fa';

@Component({
  selector: 'app-import',
  imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatSelectModule, MatSlideToggleModule, MatProgressBarModule, ...FA_PIPES],
  template: `
  <div class="page">
    <div class="page-head">
      <h1>ورود کالا از اکسل</h1>
      <a mat-stroked-button [href]="api.templateUrl(false)"><span class="material-symbols-outlined">download</span> قالب خالی</a>
      <a mat-stroked-button [href]="api.templateUrl(true)"><span class="material-symbols-outlined">download</span> قالب با داده نمونه</a>
    </div>

    @if (!preview()) {
      <div class="card">
        <h2>۱. انتخاب فایل</h2>
        <p class="muted">فایل <b>.xlsx</b> (حداکثر ۵ مگابایت). ستون‌ها از روی عنوان ردیف اول شناسایی می‌شوند و قبل از ثبت می‌توانید آن‌ها را اصلاح کنید.
          تا وقتی «ثبت نهایی» را نزنید هیچ تغییری در موجودی ایجاد نمی‌شود.</p>
        <label class="drop" [class.busy]="busy()">
          <input type="file" accept=".xlsx" (change)="onFile($event)" [disabled]="busy()">
          <span class="material-symbols-outlined">upload_file</span>
          <span>{{ busy() ? 'در حال بررسی…' : 'برای انتخاب فایل کلیک کنید' }}</span>
        </label>
        @if (error()) { <div class="error-box">{{ error() }}</div> }
      </div>

      <div class="card">
        <h2>سابقه ورود اطلاعات</h2>
        <div class="table-wrap">
          <table class="t">
            <thead><tr><th>زمان</th><th>فایل</th><th>وضعیت</th><th>ردیف</th><th>جدید</th><th>به‌روز</th><th>خطا</th><th>کاربر</th></tr></thead>
            <tbody>
              @for (b of history(); track b.id) {
                <tr [class.clickable]="b.status === 'Previewed'" (click)="b.status === 'Previewed' && open(b.id)">
                  <td class="num small">{{ b.uploadedAt | faDate }}</td><td>{{ b.fileName }}</td>
                  <td><span class="badge" [class.ok]="b.status === 'Committed'" [class.warn]="b.status === 'Previewed'">{{ statusText[b.status] }}</span></td>
                  <td class="num">{{ b.totalRows | faNum }}</td><td class="num">{{ b.createdCount | faNum }}</td>
                  <td class="num">{{ b.updatedCount | faNum }}</td><td class="num">{{ b.errorRows | faNum }}</td><td>{{ b.uploadedByName }}</td>
                </tr>
              } @empty { <tr><td colspan="8" class="empty">هنوز فایلی وارد نشده است.</td></tr> }
            </tbody>
          </table>
        </div>
      </div>
    } @else {
      @let p = preview()!;
      <div class="card">
        <h2>۲. تطبیق ستون‌ها — {{ p.fileName }}</h2>
        <div class="map-grid">
          @for (f of fields(); track f.field) {
            <mat-form-field>
              <mat-label>{{ f.label }}{{ required.includes(f.field) ? ' *' : '' }}</mat-label>
              <mat-select [ngModel]="mapping()[f.field] ?? -1" (ngModelChange)="setMap(f.field, $event)" [disabled]="p.status !== 'Previewed'">
                <mat-option [value]="-1">— استفاده نشود —</mat-option>
                @for (h of p.headers; track $index) { <mat-option [value]="$index">ستون {{ $index + 1 | faNum }}: {{ h || '(بدون عنوان)' }}</mat-option> }
              </mat-select>
            </mat-form-field>
          }
        </div>
        <div class="row">
          <mat-slide-toggle [(ngModel)]="updateExisting" (ngModelChange)="revalidate()" [disabled]="p.status !== 'Previewed'">
            کالاهایی که کدشان قبلاً ثبت شده به‌روزرسانی شوند
          </mat-slide-toggle>
          <span class="muted small">{{ updateExisting ? 'مشخصات و موجودی کالای موجود با فایل جایگزین می‌شود (تغییر موجودی در تاریخچه ثبت می‌شود).' : 'کالاهای موجود دست‌نخورده می‌مانند.' }}</span>
        </div>
      </div>

      @if (busy()) { <mat-progress-bar mode="indeterminate" /> }

      <div class="card">
        <h2>۳. پیش‌نمایش</h2>
        <div class="stats">
          <div><b class="num">{{ p.totalRows | faNum }}</b><span>ردیف</span></div>
          <div class="ok"><b class="num">{{ p.createdCount | faNum }}</b><span>کالای جدید</span></div>
          <div class="gold"><b class="num">{{ p.updatedCount | faNum }}</b><span>به‌روزرسانی</span></div>
          <div><b class="num">{{ p.skippedCount | faNum }}</b><span>رد (تکراری)</span></div>
          <div class="bad"><b class="num">{{ p.errorRows | faNum }}</b><span>خطا</span></div>
        </div>
        <div class="row" style="margin:10px 0">
          <mat-slide-toggle [(ngModel)]="onlyErrors">فقط ردیف‌های دارای خطا</mat-slide-toggle>
        </div>
        <div class="table-wrap preview">
          <table class="t">
            <thead><tr><th>ردیف</th><th>نتیجه</th><th>کد</th><th>نام</th><th>عیار</th><th>وزن</th><th>اجرت</th><th>نوع</th><th>موجودی</th><th>خطاها</th></tr></thead>
            <tbody>
              @for (r of visibleRows(); track r.rowNumber) {
                <tr [class.err]="r.action === 'Error'">
                  <td class="num">{{ r.rowNumber | faNum }}</td>
                  <td><span class="badge" [class.ok]="r.action === 'Create'" [class.gold]="r.action === 'Update'" [class.bad]="r.action === 'Error'">{{ r.action | label }}</span></td>
                  <td class="num">{{ r.parsed?.sku ?? r.sku ?? '—' }}</td>
                  <td>{{ r.parsed?.name ?? cell(r.cells, 'Name') }}</td>
                  <td class="num">{{ r.parsed ? (r.parsed.purity | faNum) : cell(r.cells, 'Purity') }}</td>
                  <td class="num">{{ r.parsed ? (r.parsed.weightGrams | faNum) : cell(r.cells, 'Weight') }}</td>
                  <td class="num">{{ r.parsed ? (r.parsed.wagePercent | faNum) : cell(r.cells, 'WagePercent') }}</td>
                  <td>{{ r.parsed ? (r.parsed.trackingMode | label) : cell(r.cells, 'Tracking') }}</td>
                  <td class="num">{{ r.parsed ? (r.parsed.stock | faNum) : cell(r.cells, 'Stock') }}</td>
                  <td class="errs">{{ r.errors }}</td>
                </tr>
              } @empty { <tr><td colspan="10" class="empty">ردیفی برای نمایش نیست.</td></tr> }
            </tbody>
          </table>
        </div>
      </div>

      <div class="row actions">
        @if (p.status === 'Previewed') {
          <button mat-flat-button class="big-btn" (click)="commit()" [disabled]="busy() || (p.createdCount + p.updatedCount) === 0">
            ثبت نهایی ({{ p.createdCount + p.updatedCount | faNum }} ردیف معتبر)
          </button>
          <button mat-button (click)="discard()" [disabled]="busy()">لغو این فایل</button>
          @if (p.errorRows) { <span class="muted small">ردیف‌های دارای خطا ثبت نمی‌شوند؛ می‌توانید فایل را اصلاح و دوباره بارگذاری کنید.</span> }
        } @else {
          <div class="info-box">این فایل ثبت شد: {{ p.createdCount | faNum }} کالای جدید، {{ p.updatedCount | faNum }} به‌روزرسانی.</div>
          <button mat-stroked-button (click)="reset()">فایل دیگر</button>
        }
      </div>
    }
  </div>`,
  styles: `
    .drop { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 36px; border: 2px dashed var(--gold); border-radius: 14px; background: #fffaf0; cursor: pointer; color: var(--gold); }
    .drop input { display: none; } .drop span.material-symbols-outlined { font-size: 42px; } .drop.busy { opacity: .6; }
    .map-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 4px 12px; margin-bottom: 8px; }
    .stats { display: flex; gap: 10px; flex-wrap: wrap; }
    .stats > div { flex: 1 1 110px; border: 1px solid var(--line); border-radius: 12px; padding: 10px 14px; display: flex; flex-direction: column; }
    .stats b { font-size: 24px; } .stats span { color: var(--muted); font-size: 13px; }
    .stats .ok b { color: var(--ok); } .stats .bad b { color: var(--bad); } .stats .gold b { color: var(--gold); }
    .preview { max-height: 520px; overflow: auto; }
    tr.err { background: #fff6f6; } .errs { color: var(--bad); font-size: 13px; min-width: 220px; }
    .actions { margin-top: 16px; }
  `,
})
export class ImportPage implements OnInit {
  protected api = inject(Api);
  private snack = inject(MatSnackBar);
  private dialogs = inject(Dialogs);

  readonly required = ['Sku', 'Name', 'Weight'];
  readonly statusText: Record<string, string> = { Previewed: 'در انتظار ثبت', Committed: 'ثبت شده', Discarded: 'لغو شده' };
  fields = signal<{ field: string; label: string }[]>([]);
  history = signal<ImportBatchRow[]>([]);
  preview = signal<ImportPreview | null>(null);
  mapping = signal<Record<string, number>>({});
  busy = signal(false);
  error = signal('');
  updateExisting = true;
  private onlyErrorsSig = signal(false);
  get onlyErrors() { return this.onlyErrorsSig(); }
  set onlyErrors(v: boolean) { this.onlyErrorsSig.set(v); }

  visibleRows = computed(() => {
    const rows = this.preview()?.rows ?? [];
    return (this.onlyErrorsSig() ? rows.filter(r => r.action === 'Error') : rows).slice(0, 1000);
  });

  ngOnInit() {
    this.api.importFields().subscribe(f => this.fields.set(f));
    this.loadHistory();
  }

  loadHistory() { this.api.imports().subscribe(h => this.history.set(h)); }

  cell(cells: string[], field: string) {
    const i = this.mapping()[field];
    return i === undefined || i < 0 ? '' : (cells[i] ?? '');
  }

  private show(p: ImportPreview) { this.preview.set(p); this.mapping.set({ ...p.mapping }); }

  async onFile(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    this.busy.set(true); this.error.set('');
    try { this.show(await firstValueFrom(this.api.upload(file))); this.updateExisting = true; }
    catch (e) { this.error.set(errorMessage(e)); }
    finally { this.busy.set(false); }
  }

  async open(id: number) {
    try { this.show(await firstValueFrom(this.api.importBatch(id))); } catch (e) { this.snack.open(errorMessage(e), 'باشه'); }
  }

  setMap(field: string, index: number) {
    this.mapping.update(m => ({ ...m, [field]: index }));
    this.revalidate();
  }

  async revalidate() {
    const p = this.preview(); if (!p || p.status !== 'Previewed') return;
    this.busy.set(true);
    try { this.show(await firstValueFrom(this.api.revalidate(p.id, this.mapping(), this.updateExisting))); }
    catch (e) { this.snack.open(errorMessage(e), 'باشه'); }
    finally { this.busy.set(false); }
  }

  async commit() {
    const p = this.preview(); if (!p) return;
    const ok = await this.dialogs.confirm('ثبت نهایی ورود اطلاعات',
      `${p.createdCount} کالای جدید ثبت و ${p.updatedCount} کالا به‌روزرسانی می‌شود. ${p.errorRows ? p.errorRows + ' ردیف دارای خطا نادیده گرفته می‌شود.' : ''}`,
      { confirmText: 'ثبت نهایی' });
    if (!ok) return;
    this.busy.set(true);
    try {
      this.show(await firstValueFrom(this.api.commitImport(p.id, this.updateExisting)));
      this.snack.open('اطلاعات با موفقیت ثبت شد.', 'باشه');
      this.loadHistory();
    } catch (e) { this.snack.open(errorMessage(e), 'باشه', { duration: 8000 }); }
    finally { this.busy.set(false); }
  }

  async discard() {
    const p = this.preview(); if (!p) return;
    try { await firstValueFrom(this.api.discardImport(p.id)); } catch { /* already closed */ }
    this.reset();
  }

  reset() { this.preview.set(null); this.loadHistory(); }
}
