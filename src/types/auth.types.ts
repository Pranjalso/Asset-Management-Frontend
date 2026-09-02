export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'company_user' | 'dashboard_user';
  avatarUrl?: string | null;
  companyId?: string | null;
}

export interface AuthResponse {
  user: AuthUser;
  token?: string;
}

export interface DashboardLoginCredentials {
  email: string;
  password: string;
}

export interface DashboardAuthResponse {
  user: AuthUser;
  token?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'company_user' | 'dashboard_user';
  phone: string;
  avatarUrl: string | null;
  createdAt?: string;
}

export interface UpdateUserProfilePayload {
  name?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string | null;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
