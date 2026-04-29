import { Component, computed, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { AuthStore } from '../../../../core/auth/auth.store';
import { UserRole } from '../../../../core/models/user.model';

interface PermissionRow {
  module: string;
  description: string;
  admin: string;
  manager: string;
  member: string;
}

interface RoleCard {
  role: UserRole;
  label: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-roles-permissions-page',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './roles-permissions-page.component.html',
  styleUrl: './roles-permissions-page.component.scss',
})
export class RolesPermissionsPageComponent {
  private readonly authStore = inject(AuthStore);

  readonly currentRole = computed<UserRole>(
    () => this.authStore.user()?.role ?? 'MEMBER',
  );

  readonly roleCards: RoleCard[] = [
    {
      role: 'ADMIN',
      label: 'Administrador',
      description:
        'Acceso total a proyectos, tareas, equipo, desempeño, roles y permisos.',
      icon: 'admin_panel_settings',
    },
    {
      role: 'MANAGER',
      label: 'Jefe de proyecto',
      description:
        'Gestiona proyectos y tareas. Consulta equipo, desempeño y matriz de permisos.',
      icon: 'supervisor_account',
    },
    {
      role: 'MEMBER',
      label: 'Miembro del equipo',
      description:
        'Consulta proyectos y tareas. Puede actualizar tareas asignadas y revisar desempeño.',
      icon: 'engineering',
    },
  ];

  readonly permissionRows: PermissionRow[] = [
    {
      module: 'Dashboard',
      description: 'Consultar métricas generales del sistema.',
      admin: 'Ver',
      manager: 'Ver',
      member: 'Ver',
    },
    {
      module: 'Proyectos',
      description: 'Crear, consultar, editar y eliminar proyectos.',
      admin: 'Gestionar',
      manager: 'Gestionar',
      member: 'Solo lectura',
    },
    {
      module: 'Tareas',
      description: 'Crear, editar, mover y eliminar tareas del tablero.',
      admin: 'Gestionar',
      manager: 'Gestionar',
      member: 'Editar / mover',
    },
    {
      module: 'Equipo',
      description: 'Consultar o administrar miembros del equipo.',
      admin: 'Gestionar',
      manager: 'Ver',
      member: 'Sin acceso',
    },
    {
      module: 'Desempeño',
      description: 'Consultar indicadores de desempeño del equipo.',
      admin: 'Ver',
      manager: 'Ver',
      member: 'Ver',
    },
    {
      module: 'Roles y permisos',
      description: 'Consultar la matriz de permisos del MVP.',
      admin: 'Ver',
      manager: 'Ver',
      member: 'Sin acceso',
    },
  ];

  roleLabel(role: UserRole): string {
    const labels: Record<UserRole, string> = {
      ADMIN: 'Administrador',
      MANAGER: 'Jefe de proyecto',
      MEMBER: 'Miembro del equipo',
    };

    return labels[role];
  }

  isCurrentRole(role: UserRole): boolean {
    return this.currentRole() === role;
  }
}