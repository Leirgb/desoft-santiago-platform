import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Task, TaskPriority, TaskStatus } from '../../models/task.model';

interface TaskStatusChange {
  taskId: string;
  status: TaskStatus;
}

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
})
export class TaskCardComponent {
  readonly task = input.required<Task>();

  readonly canUpdate = input(false);
  readonly canDelete = input(false);

  readonly editTask = output<Task>();
  readonly deleteTask = output<string>();
  readonly statusChanged = output<TaskStatusChange>();

  private readonly statusOrder: TaskStatus[] = [
    'TODO',
    'IN_PROGRESS',
    'REVIEW',
    'DONE',
  ];

  priorityLabel(priority: TaskPriority): string {
    const labels: Record<TaskPriority, string> = {
      LOW: 'Baja',
      MEDIUM: 'Media',
      HIGH: 'Alta',
      CRITICAL: 'Crítica',
    };

    return labels[priority];
  }

  statusLabel(status: TaskStatus): string {
    const labels: Record<TaskStatus, string> = {
      TODO: 'Por hacer',
      IN_PROGRESS: 'En progreso',
      REVIEW: 'En revisión',
      DONE: 'Completado',
    };

    return labels[status];
  }

  canMovePrevious(status: TaskStatus): boolean {
    return this.canUpdate() && this.statusOrder.indexOf(status) > 0;
  }

  canMoveNext(status: TaskStatus): boolean {
    return (
      this.canUpdate() &&
      this.statusOrder.indexOf(status) < this.statusOrder.length - 1
    );
  }

  movePrevious(): void {
    const currentTask = this.task();
    const currentIndex = this.statusOrder.indexOf(currentTask.status);
    const nextStatus = this.statusOrder[currentIndex - 1];

    if (!nextStatus) {
      return;
    }

    this.statusChanged.emit({
      taskId: currentTask.id,
      status: nextStatus,
    });
  }

  moveNext(): void {
    const currentTask = this.task();
    const currentIndex = this.statusOrder.indexOf(currentTask.status);
    const nextStatus = this.statusOrder[currentIndex + 1];

    if (!nextStatus) {
      return;
    }

    this.statusChanged.emit({
      taskId: currentTask.id,
      status: nextStatus,
    });
  }
}