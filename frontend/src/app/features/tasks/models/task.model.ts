export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  projectName: string;
  assigneeName: string;
  dueDate: string;
  tags: string[];
}

export interface TaskFormValue {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  assigneeName: string;
  dueDate: string;
  tags: string[];
}

export interface CreateTaskRequest extends TaskFormValue {
  projectName: string;
}

export interface UpdateTaskRequest extends TaskFormValue {
  projectName: string;
}