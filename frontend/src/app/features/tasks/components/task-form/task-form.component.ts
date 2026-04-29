import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { NotificationService } from '../../../../core/notifications/notification.service';
import { Project } from '../../../projects/models/project.model';
import { UsersStore } from '../../../users/data-access/users.store';
import {
  Task,
  TaskFormValue,
  TaskPriority,
  TaskStatus,
} from '../../models/task.model';

export interface TaskFormDialogData {
  projects: Project[];
  task: Task | null;
  projectId: string | null;
}

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(
    MatDialogRef<TaskFormComponent, TaskFormValue>,
  );
  private readonly usersStore = inject(UsersStore);
  private readonly notificationService = inject(NotificationService);

  readonly data = inject<TaskFormDialogData>(MAT_DIALOG_DATA);
  readonly activeMembers = this.usersStore.activeMembers;

  readonly projects = this.data.projects;
  readonly task = this.data.task;
  readonly today = new Date().toISOString().slice(0, 10);

  readonly dialogTitle = this.task ? 'Editar tarea' : 'Nueva tarea';
  readonly dialogSubtitle = this.task
    ? 'Actualiza la información principal, prioridad y estado de la tarea.'
    : 'Define el proyecto, responsable, prioridad y estado de la nueva tarea.';

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    projectId: ['', [Validators.required]],
    assigneeName: ['', [Validators.required]],
    priority: ['MEDIUM' as TaskPriority, [Validators.required]],
    status: ['TODO' as TaskStatus, [Validators.required]],
    dueDate: ['', [Validators.required]],
    tags: ['', [Validators.required]],
  });

  readonly controls = this.form.controls;

  constructor() {
    if (this.task) {
      this.form.patchValue({
        title: this.task.title,
        description: this.task.description,
        projectId: this.task.projectId,
        assigneeName: this.task.assigneeName,
        priority: this.task.priority,
        status: this.task.status,
        dueDate: this.task.dueDate,
        tags: this.task.tags.join(', '),
      });

      this.form.markAsPristine();
      return;
    }

    this.form.patchValue({
      projectId: this.data.projectId ?? '',
      priority: 'MEDIUM',
      status: 'TODO',
      dueDate: this.today,
    });

    this.form.markAsPristine();
  }

  canSubmit(): boolean {
    return this.task ? this.form.valid && this.form.dirty : this.form.valid;
  }

  validateDueDate(): void {
    const dueDateControl = this.controls.dueDate;
    const currentErrors = { ...(dueDateControl.errors ?? {}) };

    delete currentErrors['pastDate'];

    if (this.isPastDate(dueDateControl.value)) {
      currentErrors['pastDate'] = true;
    }

    dueDateControl.setErrors(
      Object.keys(currentErrors).length ? currentErrors : null,
    );
  }

  async submit(): Promise<void> {
    this.validateDueDate();

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.formInvalid(
        'Completa correctamente los datos de la tarea antes de guardar.',
      );
      return;
    }

    if (this.task && !this.form.dirty) {
      this.notificationService.toastInfo('No hay cambios para guardar.');
      return;
    }

    const value = this.form.getRawValue();

    if (this.task) {
      const confirmed = await this.notificationService.confirmSaveChanges({
        title: 'Guardar cambios de la tarea',
        text: 'Se actualizará la información de la tarea seleccionada.',
      });

      if (!confirmed) {
        return;
      }
    }

    this.form.markAsPristine();

    this.dialogRef.close({
      title: value.title,
      description: value.description,
      projectId: value.projectId,
      assigneeName: value.assigneeName,
      priority: value.priority,
      status: value.status,
      dueDate: value.dueDate,
      tags: this.parseTags(value.tags),
    });
  }

  async cancel(): Promise<void> {
    if (this.form.dirty) {
      const confirmed = await this.notificationService.confirmDiscardChanges();

      if (!confirmed) {
        return;
      }
    }

    this.dialogRef.close();
  }

  private parseTags(value: string): string[] {
    return value
      .split(',')
      .map((tag: string) => tag.trim())
      .filter(Boolean);
  }

  private isPastDate(value: string): boolean {
    if (!value) {
      return false;
    }

    return (
      new Date(`${value}T00:00:00`).getTime() <
      new Date(`${this.today}T00:00:00`).getTime()
    );
  }
}