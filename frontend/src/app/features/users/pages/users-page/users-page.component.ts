import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

import { UserRole } from '../../../../core/models/user.model';
import { NotificationService } from '../../../../core/notifications/notification.service';
import { AbilityService } from '../../../../core/permissions/ability.service';
import { TeamMemberCardComponent } from '../../components/team-member-card/team-member-card.component';
import {
  UserFormComponent,
  UserFormDialogData,
} from '../../components/user-form/user-form.component';
import { UsersStore } from '../../data-access/users.store';
import {
  TeamMember,
  TeamMemberFormValue,
  TeamMemberStatus,
} from '../../models/team-member.model';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatOptionModule,
    MatSelectModule,
    TeamMemberCardComponent,
  ],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.scss',
})
export class UsersPageComponent {
  private readonly dialog = inject(MatDialog);
  private readonly usersStore = inject(UsersStore);
  private readonly notificationService = inject(NotificationService);
  private readonly abilityService = inject(AbilityService);

  readonly searchTerm = signal('');
  readonly selectedRole = signal<UserRole | 'ALL'>('ALL');
  readonly selectedStatus = signal<TeamMemberStatus | 'ALL'>('ALL');

  readonly members = this.usersStore.filteredMembers;
  readonly activeMembersCount = this.usersStore.activeMembersCount;
  readonly averagePerformance = this.usersStore.averagePerformance;

  readonly canCreateUser = computed(() =>
    this.abilityService.can('create', 'User'),
  );

  readonly canUpdateUser = computed(() =>
    this.abilityService.can('update', 'User'),
  );

  readonly canDeleteUser = computed(() =>
    this.abilityService.can('delete', 'User'),
  );

  readonly canManageAccess = computed(() =>
    this.abilityService.can('manage', 'all'),
  );

  onSearchChange(term: string): void {
    this.searchTerm.set(term);
    this.usersStore.setSearchTerm(term);
  }

  onRoleChange(role: UserRole | 'ALL'): void {
    this.selectedRole.set(role);
    this.usersStore.setSelectedRole(role);
  }

  onStatusChange(status: TeamMemberStatus | 'ALL'): void {
    this.selectedStatus.set(status);
    this.usersStore.setSelectedStatus(status);
  }

  onCreateMember(): void {
    this.openUserDialog(null);
  }

  onEditMember(member: TeamMember): void {
    this.openUserDialog(member);
  }

  async onDeleteMember(id: string): Promise<void> {
    const confirmed = await this.notificationService.confirmDelete({
      title: 'Eliminar miembro',
      text: 'El miembro dejará de aparecer en la gestión del equipo.',
      confirmButtonText: 'Sí, eliminarlo',
    });

    if (!confirmed) {
      return;
    }

    this.usersStore.delete(id);
    this.notificationService.toastSuccess('Miembro eliminado correctamente');
  }

  async onSendInvitation(member: TeamMember): Promise<void> {
    const confirmed = await this.notificationService.confirmAction({
      title: 'Enviar invitación',
      text: `Se simulará el envío de una invitación a ${member.email}.`,
      confirmButtonText: 'Enviar invitación',
    });

    if (!confirmed) {
      return;
    }

    this.usersStore.sendInvitation(member.id);

    await this.notificationService.success(
      'Invitación preparada',
      'En producción, el usuario recibiría un enlace seguro para definir su contraseña.',
    );
  }

  async onResetAccess(member: TeamMember): Promise<void> {
    const confirmed = await this.notificationService.confirmAction({
      title: 'Restablecer acceso',
      text: `Se simulará el restablecimiento de acceso para ${member.email}.`,
      confirmButtonText: 'Restablecer acceso',
    });

    if (!confirmed) {
      return;
    }

    this.usersStore.resetAccess(member.id);

    await this.notificationService.success(
      'Acceso restablecido',
      'En producción, se enviaría un enlace temporal para cambiar la contraseña.',
    );
  }

  async onToggleStatus(member: TeamMember): Promise<void> {
    const nextAction = member.status === 'ACTIVE' ? 'desactivar' : 'activar';

    const confirmed = await this.notificationService.confirmAction({
      title: `${nextAction === 'activar' ? 'Activar' : 'Desactivar'} usuario`,
      text: `Se va a ${nextAction} el acceso de ${member.fullName}.`,
      confirmButtonText: `Sí, ${nextAction}`,
      confirmButtonTone: member.status === 'ACTIVE' ? 'danger' : 'primary',
    });

    if (!confirmed) {
      return;
    }

    const updated = this.usersStore.toggleActiveStatus(member.id);

    this.notificationService.toastSuccess(
      updated?.status === 'ACTIVE'
        ? 'Usuario activado correctamente'
        : 'Usuario desactivado correctamente',
    );
  }

  private openUserDialog(member: TeamMember | null): void {
    const dialogRef = this.dialog.open<
      UserFormComponent,
      UserFormDialogData,
      TeamMemberFormValue
    >(UserFormComponent, {
      width: 'min(760px, calc(100vw - 32px))',
      maxWidth: '860px',
      maxHeight: 'calc(100vh - 32px)',
      autoFocus: 'first-tabbable',
      restoreFocus: true,
      disableClose: true,
      panelClass: 'ds-task-dialog-panel',
      data: {
        member,
      },
    });

    dialogRef.afterClosed().subscribe((value) => {
      if (!value) {
        return;
      }

      if (member) {
        this.usersStore.update(member.id, value);
        this.notificationService.toastSuccess('Miembro actualizado correctamente');
        return;
      }

      this.usersStore.create(value);
      this.notificationService.toastSuccess('Miembro agregado correctamente');
    });
  }
}