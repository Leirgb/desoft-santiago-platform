import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import { NotificationService } from '../../../../core/notifications/notification.service';
import { UsersStore } from '../../../users/data-access/users.store';
import { TeamMemberFunctionalRole } from '../../../users/models/team-member.model';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatOptionModule,
    MatSelectModule,
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
})
export class RegisterPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly usersStore = inject(UsersStore);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  readonly form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    department: ['', [Validators.required]],
    functionalRole: ['DEVELOPER' as TeamMemberFunctionalRole, [Validators.required]],
    skills: ['', [Validators.required]],
  });

  readonly controls = this.form.controls;

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.formInvalid(
        'Completa correctamente los datos para crear la cuenta.',
      );
      return;
    }

    const value = this.form.getRawValue();
    const existingMember = this.usersStore.findByEmail(value.email);

    if (existingMember) {
      this.notificationService.toastError(
        'Ya existe un usuario registrado con ese correo.',
      );
      return;
    }

    this.usersStore.create({
      fullName: value.fullName,
      email: value.email,
      accessRole: 'MEMBER',
      functionalRole: value.functionalRole,
      department: value.department,
      status: 'ACTIVE',
      skills: this.parseSkills(value.skills),
    });

    this.notificationService.toastSuccess(
      'Cuenta creada. Puedes iniciar sesión con la contraseña demo 123456.',
    );

    void this.router.navigateByUrl('/auth/login');
  }

  private parseSkills(value: string): string[] {
    return value
      .split(',')
      .map((skill: string) => skill.trim())
      .filter(Boolean);
  }
}