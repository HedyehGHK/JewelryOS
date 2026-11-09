import { Pipe, PipeTransform } from '@angular/core';

const money = new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 0 });
const num = new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 3 });
const dateTime = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tehran' });
const dateOnly = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Tehran' });
const shortDate = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { month: 'short', day: 'numeric', timeZone: 'UTC' });

/** Converts Persian/Arabic digits and separators to a JS number. Returns NaN when not a number. */
export function parseNumber(v: unknown): number {
  if (typeof v === 'number') return v;
  if (v === null || v === undefined) return NaN;
  const s = String(v).trim()
    .replace(/[۰-۹]/g, d => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, d => String(d.charCodeAt(0) - 0x0660))
    .replace(/[٫]/g, '.')
    .replace(/[,،٬\s\u200c]/g, '');
  if (s === '') return NaN;
  return /^-?\d*\.?\d+$|^-?\d+\.?$/.test(s) ? Number(s) : NaN;
}

export function faMoney(v: number | null | undefined): string { return v === null || v === undefined ? '—' : money.format(v); }
export function faNum(v: number | null | undefined): string { return v === null || v === undefined ? '—' : num.format(v); }

/** Turns a raw number typed into a field into a grouped Persian display (e.g. ۹٬۸۵۰٬۰۰۰). */
export function groupDigits(v: string): string {
  const n = parseNumber(v);
  return Number.isFinite(n) ? money.format(n) : v;
}

@Pipe({ name: 'money' })
export class MoneyPipe implements PipeTransform { transform(v: number | null | undefined) { return faMoney(v); } }

@Pipe({ name: 'faNum' })
export class FaNumPipe implements PipeTransform { transform(v: number | null | undefined) { return faNum(v); } }

@Pipe({ name: 'faDate' })
export class FaDatePipe implements PipeTransform {
  transform(v: string | null | undefined, mode: 'datetime' | 'date' | 'short' = 'datetime') {
    if (!v) return '—';
    // API returns UTC timestamps without a zone marker; treat them as UTC.
    const d = new Date(/[zZ]|[+-]\d\d:\d\d$/.test(v) || mode === 'short' ? v : v + 'Z');
    return (mode === 'date' ? dateOnly : mode === 'short' ? shortDate : dateTime).format(d);
  }
}

export const statusLabel: Record<string, string> = {
  Issued: 'صادر شده', Voided: 'باطل شده', Returned: 'مرجوع شده',
  Owner: 'مدیر', Seller: 'فروشنده', Active: 'فعال', Archived: 'بایگانی',
  Initial: 'موجودی اولیه', Import: 'ورود از اکسل', Adjustment: 'اصلاح دستی', Sale: 'فروش', Void: 'ابطال فاکتور', Return: 'مرجوعی',
  Create: 'جدید', Update: 'به‌روزرسانی', Skip: 'رد (تکراری)', Error: 'خطا',
  WageAndProfit: 'فقط روی اجرت و سود (و سنگ)', WholePrice: 'روی کل مبلغ',
};

@Pipe({ name: 'label' })
export class LabelPipe implements PipeTransform { transform(v: string | null | undefined) { return v ? (statusLabel[v] ?? v) : '—'; } }

export const FA_PIPES = [MoneyPipe, FaNumPipe, FaDatePipe, LabelPipe] as const;
