import { Routes } from '@angular/router';

import { authGuard } from './core/auth/auth.guard';
import { guestGuard } from './core/auth/guest.guard';
import { ShellComponent } from './core/layout/shell/shell.component';
import { permissionGuard } from './core/permissions/permission.guard';
import { LoginPageComponent } from './features/auth/pages/login-page/login-page.component';
import { RegisterPageComponent } from './features/auth/pages/register-page/register-page.component';
import { DashboardPageComponent } from './features/dashboard/pages/dashboard-page/dashboard-page.component';
import { PerformancePageComponent } from './features/performance/pages/performance-page/performance-page.component';
import { ProjectDetailPageComponent } from './features/projects/pages/project-detail-page/project-detail-page.component';
import { ProjectFormPageComponent } from './features/projects/pages/project-form-page/project-form-page.component';
import { ProjectListPageComponent } from './features/projects/pages/project-list-page/project-list-page.component';
import { ProjectBoardPageComponent } from './features/tasks/pages/project-board-page/project-board-page.component';
import { UsersPageComponent } from './features/users/pages/users-page/users-page.component';
import { RolesPermissionsPageComponent } from './features/roles-permissions/pages/roles-permissions-page/roles-permissions-page.component';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [guestGuard],
    children: [
      {
        path: 'login',
        component: LoginPageComponent,
      },
      {
        path: 'register',
        component: RegisterPageComponent,
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
      },
    ],
  },
  {
    path: 'app',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      {
          path: 'roles-permissions',
          component: RolesPermissionsPageComponent,
          canActivate: [permissionGuard],
          data: {
            permission: {
              action: 'read',
              subject: 'RolePermission',
          },
        },
      },
      {
        path: 'dashboard',
        component: DashboardPageComponent,
        canActivate: [permissionGuard],
        data: {
          permission: {
            action: 'read',
            subject: 'Dashboard',
          },
        },
      },
      {
        path: 'projects',
        component: ProjectListPageComponent,
        canActivate: [permissionGuard],
        data: {
          permission: {
            action: 'read',
            subject: 'Project',
          },
        },
      },
      {
        path: 'projects/new',
        component: ProjectFormPageComponent,
        canActivate: [permissionGuard],
        data: {
          permission: {
            action: 'create',
            subject: 'Project',
          },
        },
      },
      {
        path: 'projects/:id/edit',
        component: ProjectFormPageComponent,
        canActivate: [permissionGuard],
        data: {
          permission: {
            action: 'update',
            subject: 'Project',
          },
        },
      },
      {
        path: 'projects/:id/board',
        component: ProjectBoardPageComponent,
        canActivate: [permissionGuard],
        data: {
          permission: {
            action: 'read',
            subject: 'Task',
          },
        },
      },
      {
        path: 'projects/:id',
        component: ProjectDetailPageComponent,
        canActivate: [permissionGuard],
        data: {
          permission: {
            action: 'read',
            subject: 'Project',
          },
        },
      },
      {
        path: 'tasks',
        component: ProjectBoardPageComponent,
        canActivate: [permissionGuard],
        data: {
          permission: {
            action: 'read',
            subject: 'Task',
          },
        },
      },
      {
        path: 'users',
        component: UsersPageComponent,
        canActivate: [permissionGuard],
        data: {
          permission: {
            action: 'read',
            subject: 'User',
          },
        },
      },
      {
        path: 'performance',
        component: PerformancePageComponent,
        canActivate: [permissionGuard],
        data: {
          permission: {
            action: 'read',
            subject: 'Performance',
          },
        },
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
    ],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth/login',
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];