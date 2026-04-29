import { UserRole } from '../../../core/models/user.model';

export type TeamMemberFunctionalRole =
  | 'PROJECT_MANAGER'
  | 'DEVELOPER'
  | 'QA'
  | 'ANALYST'
  | 'DESIGNER'
  | 'ARCHITECT';

export type TeamMemberStatus =
  | 'PENDING_INVITATION'
  | 'ACTIVE'
  | 'INACTIVE'
  | 'BLOCKED';

export interface TeamMember {
  id: string;
  fullName: string;
  email: string;
  accessRole: UserRole;
  functionalRole: TeamMemberFunctionalRole;
  department: string;
  status: TeamMemberStatus;
  assignedProjects: number;
  completedTasks: number;
  pendingTasks: number;
  performanceScore: number;
  skills: string[];
  invitationSentAt?: string | null;
  lastAccessResetAt?: string | null;
}

export interface TeamMemberFormValue {
  fullName: string;
  email: string;
  accessRole: UserRole;
  functionalRole: TeamMemberFunctionalRole;
  department: string;
  status: TeamMemberStatus;
  skills: string[];
}