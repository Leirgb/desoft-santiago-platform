import { computed, Injectable, signal } from '@angular/core';

import { PROJECTS_MOCK } from '../data/projects.mock';
import {
  CreateProjectRequest,
  Project,
  ProjectStatus,
  UpdateProjectRequest,
} from '../models/project.model';

const STORAGE_KEY = 'desoft_projects';

@Injectable({ providedIn: 'root' })
export class ProjectsStore {
  private readonly projectsSignal = signal<Project[]>(this.loadInitialProjects());
  private readonly searchTermSignal = signal('');
  private readonly selectedStatusSignal = signal<ProjectStatus | 'ALL'>('ALL');

  readonly projects = this.projectsSignal.asReadonly();
  readonly searchTerm = this.searchTermSignal.asReadonly();
  readonly selectedStatus = this.selectedStatusSignal.asReadonly();

  readonly filteredProjects = computed(() => {
    const term = this.searchTermSignal().trim().toLowerCase();
    const status = this.selectedStatusSignal();

    return this.projectsSignal().filter((project: Project) => {
      const matchesStatus = status === 'ALL' || project.status === status;

      const matchesSearch =
        !term ||
        project.name.toLowerCase().includes(term) ||
        project.description.toLowerCase().includes(term) ||
        project.owner.toLowerCase().includes(term) ||
        project.technologies.some((technology: string) =>
          technology.toLowerCase().includes(term),
        );

      return matchesStatus && matchesSearch;
    });
  });

  readonly activeProjectsCount = computed(() =>
    this.projectsSignal().filter((project: Project) => project.status === 'ACTIVE').length,
  );

  setSearchTerm(term: string): void {
    this.searchTermSignal.set(term);
  }

  setSelectedStatus(status: ProjectStatus | 'ALL'): void {
    this.selectedStatusSignal.set(status);
  }

  findById(id: string): Project | undefined {
    return this.projectsSignal().find((project: Project) => project.id === id);
  }

  create(payload: CreateProjectRequest): Project {
    const project: Project = {
      id: this.generateId(),
      ...payload,
      status: 'ACTIVE',
      progress: 0,
      tasksCount: 0,
      completedTasksCount: 0,
      membersCount: 1,
      technologies: this.normalizeTechnologies(payload.technologies),
    };

    this.projectsSignal.update((projects: Project[]) => [project, ...projects]);
    this.persist();

    return project;
  }

  update(id: string, payload: UpdateProjectRequest): Project | undefined {
    let updatedProject: Project | undefined;

    this.projectsSignal.update((projects: Project[]) =>
      projects.map((project: Project) => {
        if (project.id !== id) {
          return project;
        }

        updatedProject = {
          ...project,
          ...payload,
          technologies: this.normalizeTechnologies(payload.technologies),
        };

        return updatedProject;
      }),
    );

    this.persist();

    return updatedProject;
  }

  delete(id: string): void {
    this.projectsSignal.update((projects: Project[]) =>
      projects.filter((project: Project) => project.id !== id),
    );

    this.persist();
  }

  private loadInitialProjects(): Project[] {
    const rawProjects = localStorage.getItem(STORAGE_KEY);

    if (!rawProjects) {
      return PROJECTS_MOCK;
    }

    try {
      const projects = JSON.parse(rawProjects) as Project[];
      return Array.isArray(projects) ? projects : PROJECTS_MOCK;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return PROJECTS_MOCK;
    }
  }

  private persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.projectsSignal()));
  }

  private normalizeTechnologies(technologies: string[]): string[] {
    return technologies
      .map((technology: string) => technology.trim())
      .filter(Boolean);
  }

  private generateId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }

    return `project-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  }
}