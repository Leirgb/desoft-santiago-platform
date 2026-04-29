import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AbilityService } from '../../../../core/permissions/ability.service';
import { MetricCardComponent } from '../../../../shared/ui/metric-card/metric-card.component';
import { DashboardStore } from '../../data-access/dashboard.store';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MetricCardComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent {
  private readonly router = inject(Router);
  private readonly dashboardStore = inject(DashboardStore);
  private readonly abilityService = inject(AbilityService);

  readonly viewModel = this.dashboardStore.viewModel;

  readonly canCreateProject = computed(() =>
    this.abilityService.can('create', 'Project'),
  );

  onCreateProject(): void {
    this.router.navigateByUrl('/app/projects/new');
  }

  onViewProjects(): void {
    this.router.navigateByUrl('/app/projects');
  }

  onViewTasks(): void {
    this.router.navigateByUrl('/app/tasks');
  }
}