import { computed, Injectable, signal } from '@angular/core';

import { TASKS_MOCK } from '../data/tasks.mock';
import {
  CreateTaskRequest,
  Task,
  TaskStatus,
  UpdateTaskRequest,
} from '../models/task.model';

const STORAGE_KEY = 'desoft_tasks';

@Injectable({ providedIn: 'root' })
export class TasksStore {
  private readonly tasksSignal = signal<Task[]>(this.loadInitialTasks());
  private readonly searchTermSignal = signal('');

  readonly tasks = this.tasksSignal.asReadonly();
  readonly searchTerm = this.searchTermSignal.asReadonly();

  readonly filteredTasks = computed(() => {
    const term = this.searchTermSignal().trim().toLowerCase();

    if (!term) {
      return this.tasksSignal();
    }

    return this.tasksSignal().filter((task: Task) => {
      return (
        task.title.toLowerCase().includes(term) ||
        task.description.toLowerCase().includes(term) ||
        task.projectName.toLowerCase().includes(term) ||
        task.assigneeName.toLowerCase().includes(term) ||
        task.tags.some((tag: string) => tag.toLowerCase().includes(term))
      );
    });
  });

  readonly pendingTasksCount = computed(() =>
    this.tasksSignal().filter((task: Task) => task.status !== 'DONE').length,
  );

  readonly completedTasksCount = computed(() =>
    this.tasksSignal().filter((task: Task) => task.status === 'DONE').length,
  );

  setSearchTerm(term: string): void {
    this.searchTermSignal.set(term);
  }

  findById(id: string): Task | undefined {
    return this.tasksSignal().find((task: Task) => task.id === id);
  }

  tasksByProject(projectId: string): Task[] {
    return this.filteredTasks().filter((task: Task) => task.projectId === projectId);
  }

  tasksByStatus(tasks: Task[], status: TaskStatus): Task[] {
    return tasks.filter((task: Task) => task.status === status);
  }

  create(payload: CreateTaskRequest): Task {
    const task: Task = {
      id: this.generateId(),
      ...payload,
      tags: this.normalizeTags(payload.tags),
    };

    this.tasksSignal.update((tasks: Task[]) => [task, ...tasks]);
    this.persist();

    return task;
  }

  update(id: string, payload: UpdateTaskRequest): Task | undefined {
    let updatedTask: Task | undefined;

    this.tasksSignal.update((tasks: Task[]) =>
      tasks.map((task: Task) => {
        if (task.id !== id) {
          return task;
        }

        updatedTask = {
          ...task,
          ...payload,
          tags: this.normalizeTags(payload.tags),
        };

        return updatedTask;
      }),
    );

    this.persist();

    return updatedTask;
  }

  moveToStatus(id: string, status: TaskStatus): void {
    this.tasksSignal.update((tasks: Task[]) =>
      tasks.map((task: Task) =>
        task.id === id
          ? {
              ...task,
              status,
            }
          : task,
      ),
    );

    this.persist();
  }

  delete(id: string): void {
    this.tasksSignal.update((tasks: Task[]) =>
      tasks.filter((task: Task) => task.id !== id),
    );

    this.persist();
  }

  private loadInitialTasks(): Task[] {
    const rawTasks = localStorage.getItem(STORAGE_KEY);

    if (!rawTasks) {
      return TASKS_MOCK;
    }

    try {
      const tasks = JSON.parse(rawTasks) as Task[];
      return Array.isArray(tasks) ? tasks : TASKS_MOCK;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return TASKS_MOCK;
    }
  }

  private persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasksSignal()));
  }

  private normalizeTags(tags: string[]): string[] {
    return tags.map((tag: string) => tag.trim()).filter(Boolean);
  }

  private generateId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }

    return `task-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  }
}