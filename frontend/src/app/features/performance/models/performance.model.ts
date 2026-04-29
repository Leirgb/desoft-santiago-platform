import { TeamMember } from '../../users/models/team-member.model';

export type PerformanceLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface PerformanceMemberMetrics {
  member: TeamMember;
  assignedTasks: number;
  completedTasks: number;
  pendingTasks: number;
  reviewTasks: number;
  overdueTasks: number;
  completionRate: number;
  workloadScore: number;
  deliveryScore: number;
  finalScore: number;
  level: PerformanceLevel;
}

export interface PerformanceSummary {
  totalMembers: number;
  highPerformanceMembers: number;
  mediumPerformanceMembers: number;
  lowPerformanceMembers: number;
  averageScore: number;
  totalAssignedTasks: number;
  totalCompletedTasks: number;
}