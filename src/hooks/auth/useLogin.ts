import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/src/services';
import { ROUTES } from '@/src/constants/routes';
import type { LoginCredentials } from '@/src/types';
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

export function useLogin() {
  const router = useRouter();
  const ctx = useAuthContext();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(credentials);
      // Pass both user AND token so AuthProvider sets the cookie the proxy reads
      ctx.loginAdmin(response.user, response.token);
      const redirectTo = getRedirectParam();
      router.replace(redirectTo ?? ROUTES.DASHBOARD);
    } catch (err: unknown) {
      setError(normalizeApiError(err, 'Login failed. Please try again.').message);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}
