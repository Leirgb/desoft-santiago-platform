import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AbilityService } from '../../../../core/permissions/ability.service';
import { ProjectsStore } from '../../data-access/projects.store';
import { ProjectPriority, ProjectStatus } from '../../models/project.model';

@Component({
  selector: 'app-project-detail-page',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './project-detail-page.component.html',
  styleUrl: './project-detail-page.component.scss',
})
export class ProjectDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly projectsStore = inject(ProjectsStore);
  private readonly abilityService = inject(AbilityService);

  private readonly projectId = this.route.snapshot.paramMap.get('id') ?? '';

  readonly project = computed(() => this.projectsStore.findById(this.projectId));

  readonly canUpdateProject = computed(() =>
    this.abilityService.can('update', 'Project'),
  );

  readonly canReadTasks = computed(() => this.abilityService.can('read', 'Task'));

  statusLabel(status: ProjectStatus): string {
    const labels: Record<ProjectStatus, string> = {
      ACTIVE: 'Activo',
      PAUSED: 'Pausado',
      COMPLETED: 'Completado',
    };

    return labels[status];
  }

  priorityLabel(priority: ProjectPriority): string {
    const labels: Record<ProjectPriority, string> = {
      LOW: 'Baja',
      MEDIUM: 'Media',
      HIGH: 'Alta',
      CRITICAL: 'Crítica',
    };

    return labels[priority];
  }

  goBack(): void {
    this.router.navigateByUrl('/app/projects');
  }

  editProject(): void {
    this.router.navigate(['/app/projects', this.projectId, 'edit']);
  }

  openBoard(): void {
    this.router.navigate(['/app/projects', this.projectId, 'board']);
  }
}