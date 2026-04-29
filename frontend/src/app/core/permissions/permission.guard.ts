import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AbilityService } from './ability.service';
import { RoutePermission } from './permissions.model';

export const permissionGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const abilityService = inject(AbilityService);

  const permission = route.data['permission'] as RoutePermission | undefined;

  if (!permission) {
    return true;
  }

  if (abilityService.can(permission.action, permission.subject)) {
    return true;
  }

  return router.createUrlTree(['/app/dashboard']);
};