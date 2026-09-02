import { apiRequest } from '@/src/lib/api-client';
import type {
  UserProfile,
  UpdateUserProfilePayload,
  ChangePasswordPayload,
} from '@/src/types';

const BASE_PATH = '/api/dashboard/auth/profile';

function unwrap<T>(envelope: { success: boolean; data: T; message?: string }): T {
  return envelope.data;
}

export const companyProfileService = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await apiRequest<{ success: boolean; data: UserProfile }>(
      BASE_PATH,
      { method: 'GET' }
    );
    return unwrap(response);
  },

  updateProfile: async (
    data: UpdateUserProfilePayload
  ): Promise<UserProfile> => {
    const response = await apiRequest<{ success: boolean; data: UserProfile }>(
      BASE_PATH,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
    return unwrap(response);
  },

  changePassword: async (payload: ChangePasswordPayload): Promise<void> => {
    await apiRequest<{ success: boolean; message?: string }>(
      `${BASE_PATH}/change-password`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
  },
};
