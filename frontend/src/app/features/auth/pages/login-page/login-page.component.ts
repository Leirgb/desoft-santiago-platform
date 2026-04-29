import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

import { AuthStore } from '../../../../core/auth/auth.store';
import { UserRole } from '../../../../core/models/user.model';
import { NotificationService } from '../../../../core/notifications/notification.service';
import { UsersStore } from '../../../users/data-access/users.store';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  private readonly authStore = inject(AuthStore);
  private readonly usersStore = inject(UsersStore);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  email = 'admin@desoft.cu';
  password = '123456';
  rememberSession = true;
  passwordVisible = false;

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  showForgotPasswordInfo(): void {
    void this.notificationService.info(
      'Restablecimiento de acceso',
      'En producción se enviaría un enlace seguro para restablecer la contraseña.',
    );
  }

  login(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      this.notificationService.formInvalid(
        'Completa el correo y la contraseña para iniciar sesión.',
      );
      return;
    }

    const member = this.usersStore.validateDemoCredentials(
      this.email,
      this.password,
    );

    if (!member) {
      this.notificationService.toastError(
        'Credenciales inválidas o usuario inactivo.',
      );
      return;
    }

    this.authStore.setSession('fake-access-token', {
      id: member.id,
      fullName: member.fullName,
      email: member.email,
      role: member.accessRole,
      organizationId: 'org-1',
    });

    this.notificationService.toastSuccess(
      `Sesión iniciada como ${this.roleLabel(member.accessRole)}`,
    );

    void this.router.navigateByUrl('/app/dashboard');
  }

  private roleLabel(role: UserRole): string {
    const labels: Record<UserRole, string> = {
      ADMIN: 'Administrador',
      MANAGER: 'Jefe de proyecto',
      MEMBER: 'Miembro del equipo',
    };

    return labels[role];
  }
}