import { apiRequest } from '@/src/lib/api-client';
import type {
  UserProfile,
  UpdateUserProfilePayload,
  ChangePasswordPayload,
} from '@/src/types';

type ProfileMode = 'admin' | 'dashboard';

const PATH_BY_MODE: Record<ProfileMode, string> = {
  admin: '/api/auth/profile',
  dashboard: '/api/dashboard/auth/profile',
};

function unwrap<T>(envelope: { success: boolean; data: T; message?: string }): T {
  return envelope.data;
}

export function createProfileService(mode: ProfileMode) {
  const basePath = PATH_BY_MODE[mode];

  return {
    getProfile: async (): Promise<UserProfile> => {
      const response = await apiRequest<{
        success: boolean;
        data: UserProfile;
      }>(basePath, { method: 'GET' });
      return unwrap(response);
    },

    updateProfile: async (
      payload: UpdateUserProfilePayload
    ): Promise<UserProfile> => {
      const response = await apiRequest<{
        success: boolean;
        data: UserProfile;
      }>(basePath, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      return unwrap(response);
    },

    changePassword: async (payload: ChangePasswordPayload): Promise<void> => {
      await apiRequest<{ success: boolean; message?: string }>(
        `${basePath}/change-password`,
        {
          method: 'POST',
          body: JSON.stringify(payload),
        }
      );
    },
  };
}

export const adminProfileService = createProfileService('admin');
export const dashboardProfileService = createProfileService('dashboard');
