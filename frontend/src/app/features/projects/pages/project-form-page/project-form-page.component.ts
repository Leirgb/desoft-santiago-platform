import { Component, computed, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { NotificationService } from '../../../../core/notifications/notification.service';
import { ProjectsStore } from '../../data-access/projects.store';
import { ProjectPriority, ProjectStatus } from '../../models/project.model';

@Component({
  selector: 'app-project-form-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
  ],
  templateUrl: './project-form-page.component.html',
  styleUrl: './project-form-page.component.scss',
})
export class ProjectFormPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly projectsStore = inject(ProjectsStore);
  private readonly notificationService = inject(NotificationService);

  readonly projectId = this.route.snapshot.paramMap.get('id');
  readonly isEditMode = Boolean(this.projectId);
  readonly today = new Date().toISOString().slice(0, 10);

  readonly pageTitle = computed(() =>
    this.isEditMode ? 'Editar proyecto' : 'Crear proyecto',
  );

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    owner: ['', [Validators.required]],
    priority: ['MEDIUM' as ProjectPriority, [Validators.required]],
    status: ['ACTIVE' as ProjectStatus, [Validators.required]],
    progress: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    startDate: ['', [Validators.required]],
    dueDate: ['', [Validators.required]],
    technologies: ['', [Validators.required]],
  });

  readonly controls = this.form.controls;

  ngOnInit(): void {
    if (!this.projectId) {
      this.form.patchValue({
        startDate: this.today,
        dueDate: this.today,
      });

      this.form.markAsPristine();
      return;
    }

    const project = this.projectsStore.findById(this.projectId);

    if (!project) {
      this.notificationService.toastError('El proyecto solicitado no existe.');
      void this.router.navigateByUrl('/app/projects');
      return;
    }

    this.form.patchValue({
      name: project.name,
      description: project.description,
      owner: project.owner,
      priority: project.priority,
      status: project.status,
      progress: project.progress,
      startDate: project.startDate,
      dueDate: project.dueDate,
      technologies: project.technologies.join(', '),
    });

    this.form.markAsPristine();
    this.validateDateRange();
  }

  canSubmit(): boolean {
    if (this.form.invalid) {
      return false;
    }

    if (this.hasInvalidDateRange(this.controls.startDate.value, this.controls.dueDate.value)) {
      return false;
    }

    return this.isEditMode ? this.form.dirty : true;
  }

  minStartDate(): string {
    return this.isEditMode ? '' : this.today;
  }

  minDueDate(): string {
    return this.controls.startDate.value || this.today;
  }

  validateDateRange(): void {
    const dueDateControl = this.controls.dueDate;
    const currentErrors = { ...(dueDateControl.errors ?? {}) };

    delete currentErrors['dateRange'];

    if (this.hasInvalidDateRange(this.controls.startDate.value, dueDateControl.value)) {
      currentErrors['dateRange'] = true;
    }

    dueDateControl.setErrors(
      Object.keys(currentErrors).length ? currentErrors : null,
    );
  }

  async save(): Promise<void> {
    this.validateDateRange();

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.formInvalid(
        'Completa correctamente los datos del proyecto antes de guardar.',
      );
      return;
    }

    if (this.isEditMode && !this.form.dirty) {
      this.notificationService.toastInfo('No hay cambios para guardar.');
      return;
    }

    const value = this.form.getRawValue();

    const basePayload = {
      name: value.name,
      description: value.description,
      owner: value.owner,
      priority: value.priority,
      startDate: value.startDate,
      dueDate: value.dueDate,
      technologies: this.parseTechnologies(value.technologies),
    };

    if (this.isEditMode && this.projectId) {
      const confirmed = await this.notificationService.confirmSaveChanges({
        title: 'Guardar cambios del proyecto',
        text: 'Se actualizará la información principal del proyecto.',
      });

      if (!confirmed) {
        return;
      }

      const updated = this.projectsStore.update(this.projectId, {
        ...basePayload,
        status: value.status,
        progress: value.progress,
      });

      this.form.markAsPristine();
      this.notificationService.toastSuccess('Proyecto actualizado correctamente');
      void this.router.navigate(['/app/projects', updated?.id ?? this.projectId]);
      return;
    }

    const created = this.projectsStore.create(basePayload);
    this.form.markAsPristine();
    this.notificationService.toastSuccess('Proyecto creado correctamente');
    void this.router.navigate(['/app/projects', created.id]);
  }

  async cancel(): Promise<void> {
    if (this.form.dirty) {
      const confirmed = await this.notificationService.confirmDiscardChanges();

      if (!confirmed) {
        return;
      }
    }

    void this.router.navigateByUrl('/app/projects');
  }

  private parseTechnologies(value: string): string[] {
    return value
      .split(',')
      .map((technology: string) => technology.trim())
      .filter(Boolean);
  }

  private hasInvalidDateRange(startDate: string, dueDate: string): boolean {
    if (!startDate || !dueDate) {
      return false;
    }

    return (
      new Date(`${dueDate}T00:00:00`).getTime() <
      new Date(`${startDate}T00:00:00`).getTime()
    );
  }
}