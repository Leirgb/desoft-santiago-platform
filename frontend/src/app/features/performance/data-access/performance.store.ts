import { computed, Injectable, inject, signal } from '@angular/core';

import { TasksStore } from '../../tasks/data-access/tasks.store';
import { Task } from '../../tasks/models/task.model';
import { UsersStore } from '../../users/data-access/users.store';
import { TeamMember } from '../../users/models/team-member.model';
import {
  PerformanceLevel,
  PerformanceMemberMetrics,
  PerformanceSummary,
} from '../models/performance.model';

@Injectable({ providedIn: 'root' })
export class PerformanceStore {
  private readonly usersStore = inject(UsersStore);
  private readonly tasksStore = inject(TasksStore);

  private readonly searchTermSignal = signal('');

  readonly searchTerm = this.searchTermSignal.asReadonly();

  readonly performanceMetrics = computed<PerformanceMemberMetrics[]>(() => {
    const members = this.usersStore.members();
    const tasks = this.tasksStore.tasks();

    return members.map((member: TeamMember) =>
      this.calculateMemberMetrics(member, tasks),
    );
  });

  readonly filteredPerformanceMetrics = computed(() => {
    const term = this.searchTermSignal().trim().toLowerCase();

    if (!term) {
      return this.performanceMetrics();
    }

    return this.performanceMetrics().filter((metric: PerformanceMemberMetrics) => {
      const member = metric.member;

      return (
        member.fullName.toLowerCase().includes(term) ||
        member.email.toLowerCase().includes(term) ||
        member.department.toLowerCase().includes(term) ||
        member.skills.some((skill: string) => skill.toLowerCase().includes(term))
      );
    });
  });

  readonly summary = computed<PerformanceSummary>(() => {
    const metrics = this.performanceMetrics();

    const totalMembers = metrics.length;
    const totalAssignedTasks = metrics.reduce(
      (acc: number, metric: PerformanceMemberMetrics) => acc + metric.assignedTasks,
      0,
    );
    const totalCompletedTasks = metrics.reduce(
      (acc: number, metric: PerformanceMemberMetrics) => acc + metric.completedTasks,
      0,
    );
    const averageScore = totalMembers
      ? Math.round(
          metrics.reduce(
            (acc: number, metric: PerformanceMemberMetrics) => acc + metric.finalScore,
            0,
          ) / totalMembers,
        )
      : 0;

    return {
      totalMembers,
      highPerformanceMembers: metrics.filter(
        (metric: PerformanceMemberMetrics) => metric.level === 'HIGH',
      ).length,
      mediumPerformanceMembers: metrics.filter(
        (metric: PerformanceMemberMetrics) => metric.level === 'MEDIUM',
      ).length,
      lowPerformanceMembers: metrics.filter(
        (metric: PerformanceMemberMetrics) => metric.level === 'LOW',
      ).length,
      averageScore,
      totalAssignedTasks,
      totalCompletedTasks,
    };
  });

  setSearchTerm(term: string): void {
    this.searchTermSignal.set(term);
  }

  private calculateMemberMetrics(
    member: TeamMember,
    tasks: Task[],
  ): PerformanceMemberMetrics {
    const assignedTasks = tasks.filter(
      (task: Task) => task.assigneeName === member.fullName,
    );

    const completedTasks = assignedTasks.filter(
      (task: Task) => task.status === 'DONE',
    );

    const reviewTasks = assignedTasks.filter(
      (task: Task) => task.status === 'REVIEW',
    );

    const pendingTasks = assignedTasks.filter(
      (task: Task) => task.status !== 'DONE',
    );

    const overdueTasks = assignedTasks.filter((task: Task) =>
      this.isOverdue(task),
    );

    const completionRate = assignedTasks.length
      ? Math.round((completedTasks.length / assignedTasks.length) * 100)
      : 0;

    const deliveryScore = Math.max(0, completionRate - overdueTasks.length * 8);

    const workloadScore = this.calculateWorkloadScore(assignedTasks.length);

    const baseScore = Math.round(
      completionRate * 0.5 +
        deliveryScore * 0.3 +
        workloadScore * 0.2,
    );

    const finalScore = assignedTasks.length
      ? Math.min(100, Math.max(0, baseScore))
      : member.performanceScore;

    return {
      member,
      assignedTasks: assignedTasks.length,
      completedTasks: completedTasks.length,
      pendingTasks: pendingTasks.length,
      reviewTasks: reviewTasks.length,
      overdueTasks: overdueTasks.length,
      completionRate,
      workloadScore,
      deliveryScore,
      finalScore,
      level: this.resolveLevel(finalScore),
    };
  }

  private calculateWorkloadScore(assignedTasks: number): number {
    if (assignedTasks === 0) {
      return 60;
    }

    if (assignedTasks <= 3) {
      return 75;
    }

    if (assignedTasks <= 8) {
      return 100;
    }

    if (assignedTasks <= 12) {
      return 85;
    }

    return 70;
  }

  private resolveLevel(score: number): PerformanceLevel {
    if (score >= 85) {
      return 'HIGH';
    }

    if (score >= 65) {
      return 'MEDIUM';
    }

    return 'LOW';
  }

  private isOverdue(task: Task): boolean {
    if (task.status === 'DONE') {
      return false;
    }

    const today = new Date();
    const dueDate = new Date(`${task.dueDate}T23:59:59`);

    return dueDate.getTime() < today.getTime();
  }
}