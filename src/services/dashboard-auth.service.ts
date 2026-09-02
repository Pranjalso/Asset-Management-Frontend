import { apiRequest } from '@/src/lib/api-client';
import type { DashboardLoginCredentials, DashboardAuthResponse, AuthUser } from '@/src/types';
import { AUTH_STORAGE_KEYS } from '@/src/providers/AuthProvider';

export const dashboardAuthService = {
  login: async (
    credentials: DashboardLoginCredentials
  ): Promise<DashboardAuthResponse> => {
    const response = await apiRequest<DashboardAuthResponse>(
      '/api/dashboard/auth/login/company',
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      }
    );

    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEYS.DASHBOARD_USER, JSON.stringify(response.user));
    }
    return response;
  },

  loginWithGoogle: async (credential: string): Promise<DashboardAuthResponse> => {
    const response = await apiRequest<DashboardAuthResponse>(
      '/api/dashboard/auth/login/company/google',
      {
        method: 'POST',
        body: JSON.stringify({ credential }),
      }
    );

    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEYS.DASHBOARD_USER, JSON.stringify(response.user));
    }
    return response;
  },

  logout: async (): Promise<void> => {
    if (typeof window === 'undefined') return;

    try {
      await apiRequest('/api/dashboard/auth/logout', {
        method: 'POST',
      }).catch(() => {});
    } catch {
    }

    localStorage.removeItem(AUTH_STORAGE_KEYS.DASHBOARD_TOKEN);
    localStorage.removeItem(AUTH_STORAGE_KEYS.DASHBOARD_USER);
  },

  getCurrentUser: async (): Promise<AuthUser> => {
    const response = await apiRequest<{ success: boolean; data: AuthUser }>(
      '/api/dashboard/auth/me',
      {
        method: 'GET',
      }
    );
    return response.data;
  },
};
