import { computed, Injectable, inject } from '@angular/core';

import { MetricCardData } from '../../../shared/ui/metric-card/models/metric-card.model';
import { PerformanceStore } from '../../performance/data-access/performance.store';
import { ProjectsStore } from '../../projects/data-access/projects.store';
import { Project, ProjectStatus } from '../../projects/models/project.model';
import { TasksStore } from '../../tasks/data-access/tasks.store';
import { Task } from '../../tasks/models/task.model';
import { UsersStore } from '../../users/data-access/users.store';
import {
  DashboardActivity,
  DashboardFeaturedProject,
  DashboardViewModel,
} from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardStore {
  private readonly projectsStore = inject(ProjectsStore);
  private readonly tasksStore = inject(TasksStore);
  private readonly usersStore = inject(UsersStore);
  private readonly performanceStore = inject(PerformanceStore);

  readonly metrics = computed<MetricCardData[]>(() => {
    const projects = this.projectsStore.projects();
    const tasks = this.tasksStore.tasks();
    const activeMembers = this.usersStore.activeMembers();
    const performanceSummary = this.performanceStore.summary();

    const activeProjects = projects.filter(
      (project: Project) => project.status === 'ACTIVE',
    ).length;

    const pendingTasks = tasks.filter(
      (task: Task) => task.status !== 'DONE',
    ).length;

    const completedTasks = tasks.filter(
      (task: Task) => task.status === 'DONE',
    ).length;

    const reviewTasks = tasks.filter(
      (task: Task) => task.status === 'REVIEW',
    ).length;

    return [
      {
        label: 'Proyectos activos',
        value: String(activeProjects),
        description: `${projects.length} proyectos registrados`,
        icon: 'folder_open',
        trend: activeProjects > 0 ? 'Activo' : 'Sin actividad',
        tone: 'primary',
      },
      {
        label: 'Tareas pendientes',
        value: String(pendingTasks),
        description: `${reviewTasks} en revisión`,
        icon: 'pending_actions',
        trend: pendingTasks > 0 ? 'Seguimiento' : 'Al día',
        tone: pendingTasks > 0 ? 'warning' : 'success',
      },
      {
        label: 'Tareas completadas',
        value: String(completedTasks),
        description: 'Trabajo finalizado',
        icon: 'check_circle',
        trend: completedTasks > 0 ? 'Avance' : 'Sin cierre',
        tone: 'success',
      },
      {
        label: 'Equipo activo',
        value: String(activeMembers.length),
        description: 'Miembros disponibles',
        icon: 'groups',
        trend: 'Operativo',
        tone: 'info',
      },
      {
        label: 'Desempeño promedio',
        value: `${performanceSummary.averageScore}%`,
        description: 'Promedio del equipo',
        icon: 'monitoring',
        trend: this.resolvePerformanceTrend(performanceSummary.averageScore),
        tone: performanceSummary.averageScore >= 85 ? 'success' : 'primary',
      },
    ];
  });

  readonly featuredProjects = computed<DashboardFeaturedProject[]>(() => {
    return this.projectsStore
      .projects()
      .slice()
      .sort((a: Project, b: Project) => b.progress - a.progress)
      .slice(0, 4)
      .map((project: Project) => ({
        id: project.id,
        name: project.name,
        owner: project.owner,
        status: this.statusLabel(project.status),
        progress: project.progress,
      }));
  });

  readonly recentActivity = computed<DashboardActivity[]>(() => {
    const tasks = this.tasksStore.tasks().slice(0, 4);

    if (!tasks.length) {
      return [
        {
          id: 'empty-activity',
          icon: 'info',
          description: 'Aún no hay actividad registrada.',
          meta: 'Crea tareas para comenzar el seguimiento.',
        },
      ];
    }

    return tasks.map((task: Task) => ({
      id: task.id,
      icon: this.activityIcon(task.status),
      description: task.title,
      meta: `${task.projectName} · ${task.assigneeName}`,
    }));
  });

  readonly viewModel = computed<DashboardViewModel>(() => ({
    metrics: this.metrics(),
    featuredProjects: this.featuredProjects(),
    recentActivity: this.recentActivity(),
  }));

  private statusLabel(status: ProjectStatus): string {
    const labels: Record<ProjectStatus, string> = {
      ACTIVE: 'Activo',
      PAUSED: 'Pausado',
      COMPLETED: 'Completado',
    };

    return labels[status];
  }

  private activityIcon(status: Task['status']): string {
    const icons: Record<Task['status'], string> = {
      TODO: 'radio_button_unchecked',
      IN_PROGRESS: 'autorenew',
      REVIEW: 'rate_review',
      DONE: 'check_circle',
    };

    return icons[status];
  }

  private resolvePerformanceTrend(score: number): string {
    if (score >= 85) {
      return 'Saludable';
    }

    if (score >= 65) {
      return 'Estable';
    }

    return 'Atención';
  }
}