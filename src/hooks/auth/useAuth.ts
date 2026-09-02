import { useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthContext } from '@/src/providers/AuthProvider';
import { ROUTES } from '@/src/constants/routes';
import { authService, dashboardAuthService } from '@/src/services';
import type { AuthUser, LoginCredentials, DashboardLoginCredentials } from '@/src/types';

type LoginMode = 'admin' | 'dashboard';

interface AuthStateHelpers {
  getLoginRouteFor: (mode: LoginMode) => string;
  getHomeRouteFor: (mode: LoginMode) => string;
}

const HELPERS: AuthStateHelpers = {
  getLoginRouteFor: (mode) =>
    mode === 'admin' ? ROUTES.LOGIN : ROUTES.DASHBOARD_LOGIN,
  getHomeRouteFor: (mode) =>
    mode === 'admin' ? ROUTES.COMPANY_USER : ROUTES.COMPANY_DASHBOARD,
};

export function useAuth(mode: LoginMode = 'admin') {
  const ctx = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  const login = useCallback(
    async (credentials: LoginCredentials | DashboardLoginCredentials) => {
      if (mode === 'admin') {
        const response = await authService.login(credentials as LoginCredentials);
        ctx.loginAdmin(response.user);
        return response;
      }
      const response = await dashboardAuthService.login(
        credentials as DashboardLoginCredentials
      );
      ctx.loginDashboard(response.user);
      return response;
    },
    [mode, ctx]
  );

  const logout = useCallback(async () => {
    if (mode === 'admin') {
      await authService.logout();
      ctx.logoutAdmin();
    } else {
      await dashboardAuthService.logout();
      ctx.logoutDashboard();
    }
  }, [mode, ctx]);

  const redirectIfAuthenticated = useCallback(() => {
    const home = HELPERS.getHomeRouteFor(mode);
    if (ctx.isAuthenticated(mode === 'admin' ? 'admin' : 'dashboard_user')) {
      router.replace(home);
    }
  }, [mode, ctx, router]);

  const redirectIfUnauthenticated = useCallback(() => {
    const loginPage = HELPERS.getLoginRouteFor(mode);
    if (!ctx.isLoading && !ctx.isAuthenticated(mode === 'admin' ? 'admin' : 'dashboard_user')) {
      router.replace(`${loginPage}?redirect=${encodeURIComponent(pathname ?? HELPERS.getHomeRouteFor(mode))}`);
    }
  }, [mode, ctx, router, pathname]);

  const user: AuthUser | null =
    mode === 'admin' ? ctx.adminUser : ctx.dashboardUser;
  const isAuthenticated = ctx.isAuthenticated(
    mode === 'admin' ? 'admin' : 'dashboard_user'
  );

  return {
    user,
    isAuthenticated,
    isLoading: ctx.isLoading,
    login,
    logout,
    redirectIfAuthenticated,
    redirectIfUnauthenticated,
    token: ctx.getToken(mode === 'admin' ? 'admin' : 'dashboard_user'),
  };
}

export { HELPERS as AUTH_ROUTE_HELPERS };
