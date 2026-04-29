import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Project, ProjectPriority, ProjectStatus } from '../../models/project.model';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss',
})
export class ProjectCardComponent {
  readonly project = input.required<Project>();

  readonly canEdit = input(false);
  readonly canDelete = input(false);
  readonly canOpenBoard = input(true);

  readonly openProject = output<string>();
  readonly editProject = output<string>();
  readonly deleteProject = output<string>();
  readonly openBoard = output<string>();

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
}