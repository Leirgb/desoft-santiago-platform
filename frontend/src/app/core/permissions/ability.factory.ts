import { AbilityBuilder, createMongoAbility } from '@casl/ability';

import { User, UserRole } from '../models/user.model';
import { AppAbility } from './permissions.model';

export function buildAbilityFor(user: User | null): AppAbility {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(
    createMongoAbility,
  );

  if (!user) {
    cannot('manage', 'all');
    return build();
  }

  defineRoleAbilities(user.role, can);

  return build();
}

function defineRoleAbilities(
  role: UserRole,
  can: AbilityBuilder<AppAbility>['can'],
): void {
  if (role === 'ADMIN') {
    can('manage', 'all');
    return;
  }

  if (role === 'MANAGER') {
    can('read', 'Dashboard');

    can('create', 'Project');
    can('read', 'Project');
    can('update', 'Project');
    can('delete', 'Project');

    can('create', 'Task');
    can('read', 'Task');
    can('update', 'Task');
    can('delete', 'Task');

    can('read', 'User');
    can('read', 'Performance');
    can('read', 'RolePermission');

    return;
  }

  can('read', 'Dashboard');
  can('read', 'Project');
  can('read', 'Task');
  can('update', 'Task');
  can('read', 'Performance');
}