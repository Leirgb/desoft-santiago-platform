import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { NotificationService } from '../../../../core/notifications/notification.service';
import { AbilityService } from '../../../../core/permissions/ability.service';
import { ProjectCardComponent } from '../../components/project-card/project-card.component';
import { ProjectListToolbarComponent } from '../../components/project-list-toolbar/project-list-toolbar.component';
import { ProjectsStore } from '../../data-access/projects.store';
import { ProjectStatus } from '../../models/project.model';

@Component({
  selector: 'app-project-list-page',
  standalone: true,
  imports: [ProjectCardComponent, ProjectListToolbarComponent, MatIconModule],
  templateUrl: './project-list-page.component.html',
  styleUrl: './project-list-page.component.scss',
})
export class ProjectListPageComponent {
  private readonly router = inject(Router);
  private readonly projectsStore = inject(ProjectsStore);
  private readonly notificationService = inject(NotificationService);
  private readonly abilityService = inject(AbilityService);

  readonly projects = this.projectsStore.filteredProjects;
  readonly activeProjectsCount = this.projectsStore.activeProjectsCount;

  readonly canCreateProject = computed(() =>
    this.abilityService.can('create', 'Project'),
  );

  readonly canUpdateProject = computed(() =>
    this.abilityService.can('update', 'Project'),
  );

  readonly canDeleteProject = computed(() =>
    this.abilityService.can('delete', 'Project'),
  );

  readonly canReadTasks = computed(() => this.abilityService.can('read', 'Task'));

  onSearchChanged(term: string): void {
    this.projectsStore.setSearchTerm(term);
  }

  onStatusChanged(status: ProjectStatus | 'ALL'): void {
    this.projectsStore.setSelectedStatus(status);
  }

  onCreateProject(): void {
    this.router.navigateByUrl('/app/projects/new');
  }

  onOpenProject(id: string): void {
    this.router.navigate(['/app/projects', id]);
  }

  onEditProject(id: string): void {
    this.router.navigate(['/app/projects', id, 'edit']);
  }

  onOpenBoard(id: string): void {
    this.router.navigate(['/app/projects', id, 'board']);
  }

  async onDeleteProject(id: string): Promise<void> {
    const confirmed = await this.notificationService.confirmDelete({
      title: 'Eliminar proyecto',
      text: 'Esta acción eliminará el proyecto del listado local del MVP.',
      confirmButtonText: 'Sí, eliminarlo',
    });

    if (!confirmed) {
      return;
    }

    this.projectsStore.delete(id);
    this.notificationService.toastSuccess('Proyecto eliminado correctamente');
  }
}