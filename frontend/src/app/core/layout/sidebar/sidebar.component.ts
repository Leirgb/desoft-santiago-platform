import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { AbilityService } from '../../permissions/ability.service';
import { AppAction, AppSubject } from '../../permissions/permissions.model';

interface SidebarItem {
  label: string;
  description: string;
  icon: string;
  route: string;
  permission: {
    action: AppAction;
    subject: AppSubject;
  };
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  private readonly abilityService = inject(AbilityService);

  @Input() opened = false;
  @Output() closeSidebar = new EventEmitter<void>();

  readonly items: SidebarItem[] = [
    {
      label: 'Dashboard',
      description: 'Resumen operativo',
      icon: 'dashboard',
      route: '/app/dashboard',
      permission: {
        action: 'read',
        subject: 'Dashboard',
      },
    },
    {
      label: 'Proyectos',
      description: 'Gestión de iniciativas',
      icon: 'folder',
      route: '/app/projects',
      permission: {
        action: 'read',
        subject: 'Project',
      },
    },
    {
      label: 'Tareas',
      description: 'Tablero de trabajo',
      icon: 'view_kanban',
      route: '/app/tasks',
      permission: {
        action: 'read',
        subject: 'Task',
      },
    },
    {
      label: 'Equipo',
      description: 'Usuarios y roles',
      icon: 'groups',
      route: '/app/users',
      permission: {
        action: 'read',
        subject: 'User',
      },
    },
    {
      label: 'Roles y permisos',
      description: 'Matriz de acceso',
      icon: 'admin_panel_settings',
      route: '/app/roles-permissions',
      permission: {
        action: 'read',
        subject: 'RolePermission',
      },
    },
    {
      label: 'Desempeño',
      description: 'Evaluación del equipo',
      icon: 'monitoring',
      route: '/app/performance',
      permission: {
        action: 'read',
        subject: 'Performance',
      },
    },
  ];

  canShowItem(item: SidebarItem): boolean {
    return this.abilityService.can(item.permission.action, item.permission.subject);
  }

  onNavigate(): void {
    this.closeSidebar.emit();
  }
}
