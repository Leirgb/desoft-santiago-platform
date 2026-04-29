import { Component, computed, EventEmitter, inject, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AuthStore } from '../../auth/auth.store';
import { UserRole } from '../../models/user.model';
import { NotificationService } from '../../notifications/notification.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
})
export class TopbarComponent {
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  @Output() menuClicked = new EventEmitter<void>();

  readonly userName = this.authStore.userName;

  readonly userRoleLabel = computed(() => {
    const role = this.authStore.user()?.role;

    if (!role) {
      return 'Sin rol';
    }

    return this.roleLabel(role);
  });

  async logout(): Promise<void> {
    const confirmed = await this.notificationService.confirmLogout();

    if (!confirmed) {
      return;
    }

    this.authStore.clearSession();
    this.notificationService.toastInfo('Sesión cerrada correctamente');
    void this.router.navigateByUrl('/auth/login');
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