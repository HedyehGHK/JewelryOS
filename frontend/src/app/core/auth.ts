import { Injectable, computed, inject, signal } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Api, Me } from './api';

@Injectable({ providedIn: 'root' })
export class Auth {
  private api = inject(Api);
  readonly user = signal<Me | null>(null);
  readonly isOwner = computed(() => this.user()?.role === 'Owner');
  private checked = false;

  async ensure(): Promise<Me | null> {
    if (this.checked) return this.user();
    try { this.user.set(await firstValueFrom(this.api.me())); } catch { this.user.set(null); }
    this.checked = true;
    return this.user();
  }

  async login(username: string, password: string) {
    const me = await firstValueFrom(this.api.login(username, password));
    this.user.set(me); this.checked = true;
    return me;
  }

  async logout() {
    try { await firstValueFrom(this.api.logout()); } finally { this.user.set(null); }
  }
}

export const authGuard: CanActivateFn = async () => {
  const auth = inject(Auth), router = inject(Router);
  const me = await auth.ensure();
  if (!me) return router.parseUrl('/login');
  return true;
};

export const ownerGuard: CanActivateFn = async () => {
  const auth = inject(Auth), router = inject(Router);
  const me = await auth.ensure();
  return me?.role === 'Owner' ? true : router.parseUrl('/');
};
