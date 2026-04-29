export type ProjectStatus = 'ACTIVE' | 'PAUSED' | 'COMPLETED';

export type ProjectPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  progress: number;
  tasksCount: number;
  completedTasksCount: number;
  membersCount: number;
  owner: string;
  startDate: string;
  dueDate: string;
  technologies: string[];
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  priority: ProjectPriority;
  owner: string;
  startDate: string;
  dueDate: string;
  technologies: string[];
}

export interface UpdateProjectRequest extends CreateProjectRequest {
  status: ProjectStatus;
  progress: number;
}