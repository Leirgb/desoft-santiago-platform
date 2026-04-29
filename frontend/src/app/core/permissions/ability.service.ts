import { computed, Injectable, inject } from '@angular/core';

import { AuthStore } from '../auth/auth.store';
import { buildAbilityFor } from './ability.factory';
import { AppAction, AppSubject } from './permissions.model';

@Injectable({ providedIn: 'root' })
export class AbilityService {
  private readonly authStore = inject(AuthStore);

  readonly ability = computed(() => buildAbilityFor(this.authStore.user()));

  can(action: AppAction, subject: AppSubject): boolean {
    return this.ability().can(action, subject);
  }

  cannot(action: AppAction, subject: AppSubject): boolean {
    return this.ability().cannot(action, subject);
  }
}