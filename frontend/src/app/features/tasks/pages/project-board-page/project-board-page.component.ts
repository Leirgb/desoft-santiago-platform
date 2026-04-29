import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { map } from 'rxjs';

import { NotificationService } from '../../../../core/notifications/notification.service';
import { AbilityService } from '../../../../core/permissions/ability.service';
import { ProjectsStore } from '../../../projects/data-access/projects.store';
import {
  TaskFormComponent,
  TaskFormDialogData,
} from '../../components/task-form/task-form.component';
import { KanbanColumnComponent } from '../../components/kanban-column/kanban-column.component';
import { TasksStore } from '../../data-access/tasks.store';
import { Task, TaskFormValue, TaskStatus } from '../../models/task.model';

interface KanbanColumnConfig {
  status: TaskStatus;
  title: string;
  description: string;
}

@Component({
  selector: 'app-project-board-page',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    KanbanColumnComponent,
  ],
  templateUrl: './project-board-page.component.html',
  styleUrl: './project-board-page.component.scss',
})
export class ProjectBoardPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly projectsStore = inject(ProjectsStore);
  private readonly tasksStore = inject(TasksStore);
  private readonly notificationService = inject(NotificationService);
  private readonly abilityService = inject(AbilityService);

  readonly projectId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id'))),
    {
      initialValue: this.route.snapshot.paramMap.get('id'),
    },
  );

  readonly searchTerm = signal('');
  readonly projects = this.projectsStore.projects;

  readonly canCreateTask = computed(() =>
    this.abilityService.can('create', 'Task'),
  );

  readonly canUpdateTask = computed(() =>
    this.abilityService.can('update', 'Task'),
  );

  readonly canDeleteTask = computed(() =>
    this.abilityService.can('delete', 'Task'),
  );

  readonly selectedProject = computed(() => {
    const projectId = this.projectId();

    if (!projectId) {
      return undefined;
    }

    return this.projectsStore.findById(projectId);
  });

  readonly visibleTasks = computed(() => {
    const projectId = this.projectId();

    return projectId
      ? this.tasksStore.tasksByProject(projectId)
      : this.tasksStore.filteredTasks();
  });

  readonly totalTasks = computed(() => this.visibleTasks().length);

  readonly todoTasksCount = computed(() =>
    this.visibleTasks().filter((task: Task) => task.status === 'TODO').length,
  );

  readonly inProgressTasksCount = computed(() =>
    this.visibleTasks().filter((task: Task) => task.status === 'IN_PROGRESS').length,
  );

  readonly reviewTasksCount = computed(() =>
    this.visibleTasks().filter((task: Task) => task.status === 'REVIEW').length,
  );

  readonly doneTasksCount = computed(() =>
    this.visibleTasks().filter((task: Task) => task.status === 'DONE').length,
  );

  readonly boardTitle = computed(() => {
    const project = this.selectedProject();

    return project ? `Tablero: ${project.name}` : 'Tablero general de tareas';
  });

  readonly boardSubtitle = computed(() => {
    const project = this.selectedProject();

    return project
      ? 'Gestiona las tareas asociadas a este proyecto.'
      : 'Consulta y organiza todas las tareas activas del equipo.';
  });

  readonly columns: KanbanColumnConfig[] = [
    {
      status: 'TODO',
      title: 'Por hacer',
      description: 'Trabajo pendiente',
    },
    {
      status: 'IN_PROGRESS',
      title: 'En progreso',
      description: 'Trabajo en ejecución',
    },
    {
      status: 'REVIEW',
      title: 'En revisión',
      description: 'Validación técnica',
    },
    {
      status: 'DONE',
      title: 'Completado',
      description: 'Trabajo terminado',
    },
  ];

  onSearchChange(term: string): void {
    this.searchTerm.set(term);
    this.tasksStore.setSearchTerm(term);
  }

  tasksByStatus(status: TaskStatus): Task[] {
    return this.tasksStore.tasksByStatus(this.visibleTasks(), status);
  }

  onCreateTask(): void {
    this.openTaskDialog(null);
  }

  onEditTask(task: Task): void {
    this.openTaskDialog(task);
  }

  async onDeleteTask(id: string): Promise<void> {
    const confirmed = await this.notificationService.confirmDelete({
      title: 'Eliminar tarea',
      text: 'La tarea será eliminada del tablero Kanban.',
      confirmButtonText: 'Sí, eliminarla',
    });

    if (!confirmed) {
      return;
    }

    this.tasksStore.delete(id);
    this.notificationService.toastSuccess('Tarea eliminada correctamente');
  }

  onStatusChanged(event: { taskId: string; status: TaskStatus }): void {
    this.tasksStore.moveToStatus(event.taskId, event.status);
  }

  private openTaskDialog(task: Task | null): void {
    const dialogRef = this.dialog.open<
      TaskFormComponent,
      TaskFormDialogData,
      TaskFormValue
    >(TaskFormComponent, {
      width: 'min(860px, calc(100vw - 32px))',
      maxWidth: '960px',
      maxHeight: 'calc(100vh - 32px)',
      autoFocus: 'first-tabbable',
      restoreFocus: true,
      disableClose: true,
      panelClass: 'ds-task-dialog-panel',
      data: {
        projects: this.projects(),
        task,
        projectId: this.projectId(),
      },
    });

    dialogRef.afterClosed().subscribe((value) => {
      if (!value) {
        return;
      }

      const project = this.projectsStore.findById(value.projectId);

      const payload = {
        ...value,
        projectName: project?.name ?? 'Proyecto no identificado',
      };

      if (task) {
        this.tasksStore.update(task.id, payload);
        this.notificationService.toastSuccess('Tarea actualizada correctamente');
        return;
      }

      this.tasksStore.create(payload);
      this.notificationService.toastSuccess('Tarea creada correctamente');
    });
  }
}