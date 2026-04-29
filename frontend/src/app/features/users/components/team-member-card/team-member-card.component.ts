import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { UserRole } from '../../../../core/models/user.model';
import {
  TeamMember,
  TeamMemberFunctionalRole,
  TeamMemberStatus,
} from '../../models/team-member.model';

@Component({
  selector: 'app-team-member-card',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './team-member-card.component.html',
  styleUrl: './team-member-card.component.scss',
})
export class TeamMemberCardComponent {
  @Input({ required: true }) member!: TeamMember;
  @Input() canEdit = false;
  @Input() canDelete = false;
  @Input() canManageAccess = false;

  @Output() editMember = new EventEmitter<TeamMember>();
  @Output() deleteMember = new EventEmitter<string>();
  @Output() sendInvitation = new EventEmitter<TeamMember>();
  @Output() resetAccess = new EventEmitter<TeamMember>();
  @Output() toggleStatus = new EventEmitter<TeamMember>();

  accessRoleLabel(role: UserRole): string {
    const labels: Record<UserRole, string> = {
      ADMIN: 'Administrador',
      MANAGER: 'Jefe de proyecto',
      MEMBER: 'Miembro del equipo',
    };

    return labels[role];
  }

  functionalRoleLabel(role: TeamMemberFunctionalRole): string {
    const labels: Record<TeamMemberFunctionalRole, string> = {
      PROJECT_MANAGER: 'Jefe de proyecto',
      DEVELOPER: 'Desarrollador',
      QA: 'Calidad',
      ANALYST: 'Analista',
      DESIGNER: 'Diseñador',
      ARCHITECT: 'Arquitecto',
    };

    return labels[role];
  }

  statusLabel(status: TeamMemberStatus): string {
    const labels: Record<TeamMemberStatus, string> = {
      PENDING_INVITATION: 'Invitación pendiente',
      ACTIVE: 'Activo',
      INACTIVE: 'Inactivo',
      BLOCKED: 'Bloqueado',
    };

    return labels[status];
  }

  initials(): string {
    return this.member.fullName
      .split(' ')
      .map((part: string) => part.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }
}