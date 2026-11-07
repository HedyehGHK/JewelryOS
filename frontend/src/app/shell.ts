import { Component, computed, inject, signal } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { map } from 'rxjs';
import { Auth } from './core/auth';
import { statusLabel } from './core/fa';

interface NavItem { path: string; label: string; icon: string; owner?: boolean; exact?: boolean; }

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatSidenavModule, MatButtonModule, MatMenuModule],
  template: `
  <mat-sidenav-container class="shell">
    <mat-sidenav [mode]="mobile() ? 'over' : 'side'" [opened]="!mobile() || menuOpen()" (closedStart)="menuOpen.set(false)" position="start" class="nav no-print">
      <div class="brand"><span class="material-symbols-outlined">diamond</span> <b>JewelryOS</b></div>
      <nav>
        @for (n of visibleNav(); track n.path) {
          <a [routerLink]="n.path" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: !!n.exact }" (click)="menuOpen.set(false)">
            <span class="material-symbols-outlined">{{ n.icon }}</span> {{ n.label }}
          </a>
        }
      </nav>
    </mat-sidenav>

    <mat-sidenav-content>
      <header class="top no-print">
        @if (mobile()) {
          <button mat-icon-button (click)="menuOpen.set(true)" aria-label="منو"><span class="material-symbols-outlined">menu</span></button>
        }
        <div class="grow"></div>
        <a mat-flat-button routerLink="/sale" class="sale-btn"><span class="material-symbols-outlined">point_of_sale</span> فروش جدید</a>
        <button mat-button [matMenuTriggerFor]="userMenu" class="user-btn">
          <span class="material-symbols-outlined">account_circle</span>
          {{ auth.user()?.displayName }} <span class="muted small hide-sm">({{ roleLabel() }})</span>
        </button>
        <mat-menu #userMenu="matMenu">
          <a mat-menu-item routerLink="/account">تغییر رمز عبور</a>
          <button mat-menu-item (click)="logout()">خروج</button>
        </mat-menu>
      </header>
      @if (auth.user()?.mustChangePassword) {
        <div class="info-box must-change no-print">برای امنیت، لطفاً رمز عبور پیش‌فرض را <a routerLink="/account">همین حالا تغییر دهید</a>.</div>
      }
      <router-outlet />
    </mat-sidenav-content>
  </mat-sidenav-container>
  `,
  styles: `
    .shell { height: 100vh; background: var(--bg); }
    .nav { width: 232px; background: #2b2118; color: #f3e7cf; border: 0; }
    .brand { display: flex; align-items: center; gap: 8px; padding: 20px 20px 16px; font-size: 19px; color: #f0c766; }
    nav { display: flex; flex-direction: column; padding: 4px 10px; gap: 2px; }
    nav a { display: flex; align-items: center; gap: 12px; padding: 11px 14px; border-radius: 10px; color: #eadcc2; text-decoration: none; font-size: 15px; }
    nav a:hover { background: rgba(255,255,255,.06); }
    nav a.active { background: #f0c766; color: #2b2118; font-weight: 700; }
    .top { display: flex; align-items: center; gap: 8px; padding: 10px 18px; background: #fff; border-bottom: 1px solid var(--line); position: sticky; top: 0; z-index: 5; }
    .sale-btn { height: 42px; border-radius: 10px; }
    .must-change { margin: 12px 24px 0; }
  `,
})
export class Shell {
  protected auth = inject(Auth);
  private router = inject(Router);
  protected mobile = toSignal(inject(BreakpointObserver).observe('(max-width: 900px)').pipe(map(r => r.matches)), { initialValue: false });
  protected menuOpen = signal(false);

  private nav: NavItem[] = [
    { path: '/', label: 'داشبورد', icon: 'dashboard', exact: true },
    { path: '/sale', label: 'فروش جدید', icon: 'point_of_sale' },
    { path: '/invoices', label: 'فاکتورها', icon: 'receipt_long' },
    { path: '/products', label: 'کالاها و موجودی', icon: 'inventory_2' },
    { path: '/rates', label: 'نرخ روز طلا', icon: 'trending_up' },
    { path: '/import', label: 'ورود از اکسل', icon: 'upload_file', owner: true },
    { path: '/users', label: 'کاربران', icon: 'group', owner: true },
    { path: '/audit', label: 'گزارش فعالیت‌ها', icon: 'history', owner: true },
    { path: '/settings', label: 'تنظیمات', icon: 'settings', owner: true },
  ];
  protected visibleNav = computed(() => this.nav.filter(n => !n.owner || this.auth.isOwner()));
  protected roleLabel = computed(() => statusLabel[this.auth.user()?.role ?? ''] ?? '');

  async logout() {
    await this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
