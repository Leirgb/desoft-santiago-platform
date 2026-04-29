import type { MongoAbility } from '@casl/ability';

export type AppAction = 'manage' | 'create' | 'read' | 'update' | 'delete';

export type AppSubject =
  | 'Dashboard'
  | 'Project'
  | 'Task'
  | 'User'
  | 'Performance'
  | 'RolePermission'
  | 'all';

export type AppAbility = MongoAbility<[AppAction, AppSubject]>;

export interface RoutePermission {
  action: AppAction;
  subject: AppSubject;
}