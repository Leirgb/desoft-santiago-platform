import { Task } from '../models/task.model';

export const TASKS_MOCK: Task[] = [
  {
    id: 'task-1',
    title: 'Diseñar modelo de autenticación',
    description:
      'Definir entidades, DTOs, guards y flujo JWT para el MVP inicial.',
    status: 'DONE',
    priority: 'HIGH',
    projectId: 'project-1',
    projectName: 'Sistema de Gestión Interna',
    assigneeName: 'Equipo Backend',
    dueDate: '2026-04-25',
    tags: ['NestJS', 'Auth', 'JWT'],
  },
  {
    id: 'task-2',
    title: 'Implementar layout institucional',
    description:
      'Crear shell, sidebar, topbar y estilos base alineados al diseño Stitch.',
    status: 'DONE',
    priority: 'HIGH',
    projectId: 'project-1',
    projectName: 'Sistema de Gestión Interna',
    assigneeName: 'Equipo Frontend',
    dueDate: '2026-04-26',
    tags: ['Angular', 'Material', 'SCSS'],
  },
  {
    id: 'task-3',
    title: 'Crear módulo de proyectos',
    description:
      'Implementar listado, detalle y formulario de proyectos con Signals.',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    projectId: 'project-1',
    projectName: 'Sistema de Gestión Interna',
    assigneeName: 'Equipo Frontend',
    dueDate: '2026-04-28',
    tags: ['Angular', 'Signals'],
  },
  {
    id: 'task-4',
    title: 'Construir tablero Kanban',
    description:
      'Crear columnas por estado y tarjetas de tareas reutilizables.',
    status: 'TODO',
    priority: 'CRITICAL',
    projectId: 'project-1',
    projectName: 'Sistema de Gestión Interna',
    assigneeName: 'Equipo ProjectOps',
    dueDate: '2026-04-29',
    tags: ['Kanban', 'UX'],
  },
  {
    id: 'task-5',
    title: 'Definir métricas del dashboard',
    description:
      'Calcular métricas iniciales de proyectos, tareas y desempeño del equipo.',
    status: 'REVIEW',
    priority: 'MEDIUM',
    projectId: 'project-2',
    projectName: 'Portal de Servicios Digitales',
    assigneeName: 'Equipo BI',
    dueDate: '2026-04-30',
    tags: ['Dashboard', 'KPIs'],
  },
  {
    id: 'task-6',
    title: 'Preparar vista de desempeño',
    description:
      'Diseñar evaluación simple por usuario basada en tareas completadas.',
    status: 'TODO',
    priority: 'MEDIUM',
    projectId: 'project-4',
    projectName: 'Evaluación de Desempeño Técnico',
    assigneeName: 'Equipo ProjectOps',
    dueDate: '2026-05-02',
    tags: ['Desempeño', 'MVP'],
  },
];