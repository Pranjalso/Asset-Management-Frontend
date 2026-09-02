import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { dashboardAuthService } from '@/src/services';
import { ROUTES } from '@/src/constants/routes';
import type { DashboardLoginCredentials } from '@/src/types';
import { useAuthContext } from '@/src/providers/AuthProvider';
import { normalizeApiError } from '@/src/lib/api-errors';

function getRedirectParam(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get('redirect');
  } catch {
    return null;
  }
}

export function useDashboardLogin() {
  const router = useRouter();
  const ctx = useAuthContext();

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: DashboardLoginCredentials) => {
    try {
      setLoading(true);
      setError(null);
      await dashboardAuthService.logout().catch(() => {});
      const response = await dashboardAuthService.login(credentials);
      const currentUser = await dashboardAuthService.getCurrentUser();
      ctx.loginDashboard(currentUser, response.token);
      const redirectTo = getRedirectParam();
      router.replace(redirectTo ?? ROUTES.COMPANY_DASHBOARD);
    } catch (err: unknown) {
      setError(normalizeApiError(err, 'Login failed. Please try again.').message);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (credential: string) => {
    try {
      setGoogleLoading(true);
      setError(null);
      await dashboardAuthService.logout().catch(() => {});
      const response = await dashboardAuthService.loginWithGoogle(credential);
      const currentUser = await dashboardAuthService.getCurrentUser();
      ctx.loginDashboard(currentUser, response.token);
      const redirectTo = getRedirectParam();
      router.replace(redirectTo ?? ROUTES.COMPANY_DASHBOARD);
    } catch (err: unknown) {
      setError(normalizeApiError(err, 'Google login failed. Please try again.').message);
    } finally {
      setGoogleLoading(false);
    }
  };

  return { login, loginWithGoogle, loading, googleLoading, error };
}
