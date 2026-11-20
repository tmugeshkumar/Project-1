/**
 * Authentication & Authorization Type Definitions
 */

export type UserRole = "USER" | "ADMIN";
export type AccountStatus = "ACTIVE" | "SUSPENDED" | "PENDING_VERIFICATION";

export interface AuthUser {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
  accountStatus: AccountStatus;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
}

export interface SessionPayload {
  userId: string;
  email: string;
  role: UserRole;
  username: string;
}

export interface AdminSessionPayload {
  adminId: string;
  email: string;
  username: string;
  role: "ADMIN";
}

export interface RegisterInput {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface LoginInput {
  identifier: string; // email or username
  password: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface AdminUserListItem {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
  accountStatus: AccountStatus;
  createdAt: Date;
  lastLoginAt: Date | null;
}

export interface AdminUserDetail extends AdminUserListItem {
  updatedAt: Date;
  emailVerifiedAt: Date | null;
}

export interface AdminStats {
  totalUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  recentRegistrations: AdminUserListItem[];
}

export interface AuditLogEntry {
  id: string;
  adminId: string;
  action: string;
  targetUserId: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  admin: { fullName: string; username: string };
  targetUser: { fullName: string; username: string } | null;
}

export interface PaginatedUsers {
  users: AdminUserListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
