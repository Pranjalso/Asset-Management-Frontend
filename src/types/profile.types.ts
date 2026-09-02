export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role?: string;
}

export interface UpdateUserProfilePayload {
  name?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface ChangePasswordPayload {
  currentPassword?: string;
  newPassword: string;
  confirmPassword?: string;
}
