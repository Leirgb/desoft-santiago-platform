export type ProjectStatus = 'ACTIVE' | 'PAUSED' | 'COMPLETED';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  tasksCount: number;
  membersCount: number;
  startDate?: string;
  dueDate?: string;
}