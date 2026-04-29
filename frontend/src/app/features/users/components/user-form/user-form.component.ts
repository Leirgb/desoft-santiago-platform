import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { UserRole } from '../../../../core/models/user.model';
import { NotificationService } from '../../../../core/notifications/notification.service';
import {
  TeamMember,
  TeamMemberFormValue,
  TeamMemberFunctionalRole,
  TeamMemberStatus,
} from '../../models/team-member.model';

export interface UserFormDialogData {
  member: TeamMember | null;
}

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(
    MatDialogRef<UserFormComponent, TeamMemberFormValue>,
  );
  private readonly notificationService = inject(NotificationService);

  readonly data = inject<UserFormDialogData>(MAT_DIALOG_DATA);
  readonly member = this.data.member;

  readonly dialogTitle = this.member ? 'Editar miembro' : 'Agregar miembro';

  readonly dialogSubtitle = this.member
    ? 'Actualiza los datos principales, rol de acceso y función del miembro.'
    : 'Registra un usuario del equipo. La contraseña se gestionará por invitación segura.';

  readonly form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    accessRole: ['MEMBER' as UserRole, [Validators.required]],
    functionalRole: ['DEVELOPER' as TeamMemberFunctionalRole, [Validators.required]],
    department: ['', [Validators.required]],
    status: ['ACTIVE' as TeamMemberStatus, [Validators.required]],
    skills: ['', [Validators.required]],
  });

  readonly controls = this.form.controls;

  constructor() {
    if (!this.member) {
      this.form.markAsPristine();
      return;
    }

    this.form.patchValue({
      fullName: this.member.fullName,
      email: this.member.email,
      accessRole: this.member.accessRole,
      functionalRole: this.member.functionalRole,
      department: this.member.department,
      status: this.member.status,
      skills: this.member.skills.join(', '),
    });

    this.form.markAsPristine();
  }

  canSubmit(): boolean {
    return this.member ? this.form.valid && this.form.dirty : this.form.valid;
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.formInvalid(
        'Completa correctamente los datos del miembro antes de guardar.',
      );
      return;
    }

    if (this.member && !this.form.dirty) {
      this.notificationService.toastInfo('No hay cambios para guardar.');
      return;
    }

    if (this.member) {
      const confirmed = await this.notificationService.confirmSaveChanges({
        title: 'Guardar cambios del miembro',
        text: 'Se actualizarán los datos y permisos del miembro del equipo.',
      });

      if (!confirmed) {
        return;
      }
    }

    const value = this.form.getRawValue();

    this.form.markAsPristine();

    this.dialogRef.close({
      fullName: value.fullName,
      email: value.email,
      accessRole: value.accessRole,
      functionalRole: value.functionalRole,
      department: value.department,
      status: value.status,
      skills: this.parseSkills(value.skills),
    });
  }

  async cancel(): Promise<void> {
    if (this.form.dirty) {
      const confirmed = await this.notificationService.confirmDiscardChanges();

      if (!confirmed) {
        return;
      }
    }

    this.dialogRef.close();
  }

  private parseSkills(value: string): string[] {
    return value
      .split(',')
      .map((skill: string) => skill.trim())
      .filter(Boolean);
  }
}