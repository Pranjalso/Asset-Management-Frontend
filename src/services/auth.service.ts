import { apiRequest } from '@/src/lib/api-client';
import type { LoginCredentials, AuthResponse, AuthUser } from '@/src/types';
import { AUTH_STORAGE_KEYS } from '@/src/providers/AuthProvider';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>('/api/auth/login/admin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEYS.ADMIN_USER, JSON.stringify(response.user));
    }
    return response;
  },

  logout: async (): Promise<void> => {
    if (typeof window === 'undefined') return;

    try {
      await apiRequest('/api/auth/logout', {
        method: 'POST',
      }).catch(() => {});
    } catch {
    }

    localStorage.removeItem(AUTH_STORAGE_KEYS.ADMIN_TOKEN);
    localStorage.removeItem(AUTH_STORAGE_KEYS.ADMIN_USER);
  },

  getCurrentUser: async (): Promise<AuthUser> => {
    const response = await apiRequest<{ success: boolean; data: AuthUser }>('/api/auth/me', {
      method: 'GET',
    });
    return response.data;
  },
};
