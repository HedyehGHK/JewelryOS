import { Component, Injectable, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { firstValueFrom } from 'rxjs';

export interface AskData {
  title: string; message?: string; confirmText?: string; danger?: boolean;
  /** When set, the dialog asks for text input (e.g. a reason) and returns it. */
  inputLabel?: string; inputRequired?: boolean; inputValue?: string; inputMode?: 'text' | 'decimal';
}

@Component({
  selector: 'app-ask-dialog',
  imports: [FormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      @if (data.message) { <p class="msg">{{ data.message }}</p> }
      @if (data.inputLabel) {
        <mat-form-field style="width:100%">
          <mat-label>{{ data.inputLabel }}</mat-label>
          <input matInput [(ngModel)]="value" [attr.inputmode]="data.inputMode ?? 'text'" (keydown.enter)="ok()" cdkFocusInitial>
        </mat-form-field>
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>انصراف</button>
      <button mat-flat-button [class.danger]="data.danger" (click)="ok()" [disabled]="!!data.inputLabel && data.inputRequired !== false && !value.trim()">
        {{ data.confirmText ?? 'تأیید' }}
      </button>
    </mat-dialog-actions>`,
  styles: `.msg { white-space: pre-line; line-height: 1.9; } .danger { --mat-button-filled-container-color: #c62828; }`,
})
export class AskDialog {
  data = inject<AskData>(MAT_DIALOG_DATA);
  private ref = inject(MatDialogRef<AskDialog, string | boolean>);
  value = this.data.inputValue ?? '';
  ok() {
    if (this.data.inputLabel) { if (this.data.inputRequired !== false && !this.value.trim()) return; this.ref.close(this.value.trim()); }
    else this.ref.close(true);
  }
}

@Injectable({ providedIn: 'root' })
export class Dialogs {
  private dialog = inject(MatDialog);

  async confirm(title: string, message?: string, opts: Partial<AskData> = {}): Promise<boolean> {
    const r = await firstValueFrom(this.dialog.open(AskDialog, { data: { title, message, ...opts }, width: '440px', direction: 'rtl' }).afterClosed());
    return r === true;
  }

  async prompt(title: string, inputLabel: string, opts: Partial<AskData> = {}): Promise<string | null> {
    const r = await firstValueFrom(this.dialog.open(AskDialog, { data: { title, inputLabel, ...opts }, width: '440px', direction: 'rtl' }).afterClosed());
    return typeof r === 'string' ? r : null;
  }
}
