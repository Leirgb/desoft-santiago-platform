import { Component, input, output } from '@angular/core';

import { Task, TaskStatus } from '../../models/task.model';
import { TaskCardComponent } from '../task-card/task-card.component';

interface TaskStatusChange {
  taskId: string;
  status: TaskStatus;
}

@Component({
  selector: 'app-kanban-column',
  standalone: true,
  imports: [TaskCardComponent],
  templateUrl: './kanban-column.component.html',
  styleUrl: './kanban-column.component.scss',
})
export class KanbanColumnComponent {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly status = input.required<TaskStatus>();
  readonly tasks = input.required<Task[]>();

  readonly canUpdateTask = input(false);
  readonly canDeleteTask = input(false);

  readonly editTask = output<Task>();
  readonly deleteTask = output<string>();
  readonly statusChanged = output<TaskStatusChange>();
}