import { computed, Injectable, signal } from '@angular/core';

import { UserRole } from '../../../core/models/user.model';
import { TEAM_MEMBERS_MOCK } from '../data/users.mock';
import {
  TeamMember,
  TeamMemberFormValue,
  TeamMemberStatus,
} from '../models/team-member.model';

const STORAGE_KEY = 'desoft_team_members';

@Injectable({ providedIn: 'root' })
export class UsersStore {
  private readonly demoPassword = '123456';

  private readonly membersSignal = signal<TeamMember[]>(this.loadInitialMembers());
  private readonly searchTermSignal = signal('');
  private readonly selectedRoleSignal = signal<UserRole | 'ALL'>('ALL');
  private readonly selectedStatusSignal = signal<TeamMemberStatus | 'ALL'>('ALL');

  readonly members = this.membersSignal.asReadonly();
  readonly searchTerm = this.searchTermSignal.asReadonly();
  readonly selectedRole = this.selectedRoleSignal.asReadonly();
  readonly selectedStatus = this.selectedStatusSignal.asReadonly();

  readonly activeMembers = computed(() =>
    this.membersSignal().filter((member: TeamMember) => member.status === 'ACTIVE'),
  );

  readonly filteredMembers = computed(() => {
    const term = this.searchTermSignal().trim().toLowerCase();
    const role = this.selectedRoleSignal();
    const status = this.selectedStatusSignal();

    return this.membersSignal().filter((member: TeamMember) => {
      const matchesRole = role === 'ALL' || member.accessRole === role;
      const matchesStatus = status === 'ALL' || member.status === status;

      const matchesSearch =
        !term ||
        member.fullName.toLowerCase().includes(term) ||
        member.email.toLowerCase().includes(term) ||
        member.department.toLowerCase().includes(term) ||
        member.accessRole.toLowerCase().includes(term) ||
        member.functionalRole.toLowerCase().includes(term) ||
        member.skills.some((skill: string) => skill.toLowerCase().includes(term));

      return matchesRole && matchesStatus && matchesSearch;
    });
  });

  readonly activeMembersCount = computed(() => this.activeMembers().length);

  readonly averagePerformance = computed(() => {
    const members = this.membersSignal();

    if (!members.length) {
      return 0;
    }

    const total = members.reduce(
      (acc: number, member: TeamMember) => acc + member.performanceScore,
      0,
    );

    return Math.round(total / members.length);
  });

  setSearchTerm(term: string): void {
    this.searchTermSignal.set(term);
  }

  setSelectedRole(role: UserRole | 'ALL'): void {
    this.selectedRoleSignal.set(role);
  }

  setSelectedStatus(status: TeamMemberStatus | 'ALL'): void {
    this.selectedStatusSignal.set(status);
  }

  findById(id: string): TeamMember | undefined {
    return this.membersSignal().find((member: TeamMember) => member.id === id);
  }

  findByEmail(email: string): TeamMember | undefined {
    const normalizedEmail = email.trim().toLowerCase();

    return this.membersSignal().find(
      (member: TeamMember) => member.email.toLowerCase() === normalizedEmail,
    );
  }

  validateDemoCredentials(email: string, password: string): TeamMember | null {
    const member = this.findByEmail(email);

    if (!member) {
      return null;
    }

    if (member.status !== 'ACTIVE') {
      return null;
    }

    if (password !== this.demoPassword) {
      return null;
    }

    return member;
  }

  create(payload: TeamMemberFormValue): TeamMember {
    const member: TeamMember = {
      id: this.generateId(),
      ...payload,
      assignedProjects: 0,
      completedTasks: 0,
      pendingTasks: 0,
      performanceScore: 70,
      skills: this.normalizeSkills(payload.skills),
      invitationSentAt: null,
      lastAccessResetAt: null,
    };

    this.membersSignal.update((members: TeamMember[]) => [member, ...members]);
    this.persist();

    return member;
  }

  update(id: string, payload: TeamMemberFormValue): TeamMember | undefined {
    let updatedMember: TeamMember | undefined;

    this.membersSignal.update((members: TeamMember[]) =>
      members.map((member: TeamMember) => {
        if (member.id !== id) {
          return member;
        }

        updatedMember = {
          ...member,
          ...payload,
          skills: this.normalizeSkills(payload.skills),
        };

        return updatedMember;
      }),
    );

    this.persist();

    return updatedMember;
  }

  delete(id: string): void {
    this.membersSignal.update((members: TeamMember[]) =>
      members.filter((member: TeamMember) => member.id !== id),
    );

    this.persist();
  }

  sendInvitation(id: string): void {
    const now = new Date().toISOString();

    this.membersSignal.update((members: TeamMember[]) =>
      members.map((member: TeamMember) =>
        member.id === id
          ? {
              ...member,
              invitationSentAt: now,
            }
          : member,
      ),
    );

    this.persist();
  }

  resetAccess(id: string): void {
    const now = new Date().toISOString();

    this.membersSignal.update((members: TeamMember[]) =>
      members.map((member: TeamMember) =>
        member.id === id
          ? {
              ...member,
              lastAccessResetAt: now,
            }
          : member,
      ),
    );

    this.persist();
  }

  toggleActiveStatus(id: string): TeamMember | undefined {
    let updatedMember: TeamMember | undefined;

    this.membersSignal.update((members: TeamMember[]) =>
      members.map((member: TeamMember) => {
        if (member.id !== id) {
          return member;
        }

        updatedMember = {
          ...member,
          status: member.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
        };

        return updatedMember;
      }),
    );

    this.persist();

    return updatedMember;
  }

  private loadInitialMembers(): TeamMember[] {
    const rawMembers = localStorage.getItem(STORAGE_KEY);

    if (!rawMembers) {
      return TEAM_MEMBERS_MOCK;
    }

    try {
      const members = JSON.parse(rawMembers) as TeamMember[];

      if (!Array.isArray(members) || !this.hasCurrentShape(members)) {
        localStorage.removeItem(STORAGE_KEY);
        return TEAM_MEMBERS_MOCK;
      }

      return members;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return TEAM_MEMBERS_MOCK;
    }
  }

  private hasCurrentShape(members: TeamMember[]): boolean {
    if (!members.length) {
      return true;
    }

    const firstMember = members[0];

    return 'accessRole' in firstMember && 'functionalRole' in firstMember;
  }

  private persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.membersSignal()));
  }

  private normalizeSkills(skills: string[]): string[] {
    return skills.map((skill: string) => skill.trim()).filter(Boolean);
  }

  private generateId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }

    return `user-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  }
}