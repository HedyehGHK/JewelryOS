import { Routes } from '@angular/router';
import { authGuard, ownerGuard } from './core/auth';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/login').then(m => m.LoginPage), title: 'ورود' },
  {
    path: '', canActivate: [authGuard], loadComponent: () => import('./shell').then(m => m.Shell),
    children: [
      { path: '', loadComponent: () => import('./pages/dashboard').then(m => m.DashboardPage), title: 'داشبورد' },
      { path: 'sale', loadComponent: () => import('./pages/sale').then(m => m.SalePage), title: 'فروش جدید' },
      { path: 'products', loadComponent: () => import('./pages/products').then(m => m.ProductsPage), title: 'کالاها' },
      { path: 'products/:id', loadComponent: () => import('./pages/product-detail').then(m => m.ProductDetailPage), title: 'جزئیات کالا' },
      { path: 'invoices', loadComponent: () => import('./pages/invoices').then(m => m.InvoicesPage), title: 'فاکتورها' },
      { path: 'invoices/:id', loadComponent: () => import('./pages/invoice-detail').then(m => m.InvoiceDetailPage), title: 'فاکتور' },
      { path: 'rates', loadComponent: () => import('./pages/rates').then(m => m.RatesPage), title: 'نرخ طلا' },
      { path: 'account', loadComponent: () => import('./pages/account').then(m => m.AccountPage), title: 'حساب کاربری' },
      { path: 'import', canActivate: [ownerGuard], loadComponent: () => import('./pages/import').then(m => m.ImportPage), title: 'ورود از اکسل' },
      { path: 'users', canActivate: [ownerGuard], loadComponent: () => import('./pages/users').then(m => m.UsersPage), title: 'کاربران' },
      { path: 'settings', canActivate: [ownerGuard], loadComponent: () => import('./pages/settings').then(m => m.SettingsPage), title: 'تنظیمات' },
      { path: 'audit', canActivate: [ownerGuard], loadComponent: () => import('./pages/audit').then(m => m.AuditPage), title: 'گزارش فعالیت‌ها' },
    ],
  },
  { path: '**', redirectTo: '' },
];
