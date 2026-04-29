export type UserRole = 'ADMIN' | 'MANAGER' | 'MEMBER';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  organizationId: string;
  avatarUrl?: string;
}