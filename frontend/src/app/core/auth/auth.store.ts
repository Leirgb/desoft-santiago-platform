import { computed, Injectable, signal } from '@angular/core';

import { User } from '../models/user.model';

const LEGACY_ACCESS_TOKEN_KEY = 'desoft_access_token';
const LEGACY_USER_KEY = 'desoft_user';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly accessTokenSignal = signal<string | null>(null);
  private readonly userSignal = signal<User | null>(null);

  readonly accessToken = this.accessTokenSignal.asReadonly();
  readonly user = this.userSignal.asReadonly();

  readonly isAuthenticated = computed(() => Boolean(this.accessTokenSignal()));
  readonly userName = computed(() => this.userSignal()?.fullName ?? 'Usuario');

  constructor() {
    this.clearLegacyLocalStorageSession();
  }

  setSession(accessToken: string, user: User): void {
    this.accessTokenSignal.set(accessToken);
    this.userSignal.set(user);
  }

  clearSession(): void {
    this.accessTokenSignal.set(null);
    this.userSignal.set(null);
    this.clearLegacyLocalStorageSession();
  }

  private clearLegacyLocalStorageSession(): void {
    localStorage.removeItem(LEGACY_ACCESS_TOKEN_KEY);
    localStorage.removeItem(LEGACY_USER_KEY);
  }
}