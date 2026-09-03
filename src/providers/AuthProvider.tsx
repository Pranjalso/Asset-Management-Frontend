'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { AuthUser } from '@/src/types';
import { ROUTES } from '@/src/constants/routes';
import { authService, dashboardAuthService } from '@/src/services';

type AuthRole = 'admin' | 'dashboard_user' | null;

interface AuthTokens {
  admin?: string;
  dashboard?: string;
}

interface AuthState {
  adminUser: AuthUser | null;
  dashboardUser: AuthUser | null;
  tokens: AuthTokens;
  isAuthenticated: (role?: AuthRole) => boolean;
  isLoading: boolean;
}

interface AuthActions {
  loginAdmin: (user: AuthUser, token?: string) => void;
  loginDashboard: (user: AuthUser, token?: string) => void;
  logoutAdmin: () => Promise<void>;
  logoutDashboard: () => Promise<void>;
  logoutAll: () => Promise<void>;
  updateAdminUser: (partial: Partial<AuthUser>) => void;
  updateDashboardUser: (partial: Partial<AuthUser>) => void;
  getToken: (role: NonNullable<AuthRole>) => string | null;
}

interface AuthContextValue extends AuthState, AuthActions {}

const STORAGE_KEYS = {
  ADMIN_TOKEN: 'token',
  DASHBOARD_TOKEN: 'dashboard_token',
  ADMIN_USER: 'auth_admin_user',
  DASHBOARD_USER: 'auth_dashboard_user',
} as const;

const AuthContext = createContext<AuthContextValue | null>(null);

function readFromStorage<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeToStorage(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function clearFromStorage(keys: string[]): void {
  if (typeof window === 'undefined') return;
  keys.forEach((key) => window.localStorage.removeItem(key));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  
  const [tokens, setTokens] = useState<AuthTokens>(() => ({
    admin: typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN) ?? undefined : undefined,
    dashboard: typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEYS.DASHBOARD_TOKEN) ?? undefined : undefined,
  }));
  
  const [adminUser, setAdminUser] = useState<AuthUser | null>(() => readFromStorage<AuthUser>(STORAGE_KEYS.ADMIN_USER));
  const [dashboardUser, setDashboardUser] = useState<AuthUser | null>(() => readFromStorage<AuthUser>(STORAGE_KEYS.DASHBOARD_USER));

  useEffect(() => {
    const adminToken = tokens.admin;
    const dashboardToken = tokens.dashboard;

    const checkMissingUsers = async () => {
      let pendingChecks = 0;
      
      const hasAdminCookie = typeof document !== 'undefined' && document.cookie.includes('admin_access_token=');
      
      if (adminToken || hasAdminCookie) {
        pendingChecks++;
        authService.getCurrentUser()
          .then((user) => {
            setAdminUser(user);
            writeToStorage(STORAGE_KEYS.ADMIN_USER, user);
          })
          .catch((err) => {
            console.warn('[AuthProvider] admin getCurrentUser failed:', err);
            // Do NOT clear token here. 401s are handled by api-client.ts.
            // Clearing here deletes the token on AbortError during navigation!
          })
          .finally(() => {
            pendingChecks--;
            if (pendingChecks === 0) setIsLoading(false);
          });
      }
      
      const hasDashboardCookie = typeof document !== 'undefined' && document.cookie.includes('dashboard_access_token=');
      
      if (dashboardToken || hasDashboardCookie) {
        pendingChecks++;
        dashboardAuthService.getCurrentUser()
          .then((user) => {
            setDashboardUser(user);
            writeToStorage(STORAGE_KEYS.DASHBOARD_USER, user);
          })
          .catch((err) => {
            console.warn('[AuthProvider] dashboard getCurrentUser failed:', err);
            // Do NOT clear token here. 401s are handled by api-client.ts.
            // Clearing here deletes the token on AbortError during navigation!
          })
          .finally(() => {
            pendingChecks--;
            if (pendingChecks === 0) setIsLoading(false);
          });
      }

      if (pendingChecks === 0) {
        setIsLoading(false);
      }
    };

    void checkMissingUsers();
  }, [tokens.admin, tokens.dashboard]);

  const isAuthenticated = useCallback(
    (role?: AuthRole) => {
      switch (role) {
        case 'admin':
          return !!adminUser;
        case 'dashboard_user':
          return !!dashboardUser;
        default:
          return !!adminUser || !!dashboardUser;
      }
    },
    [adminUser, dashboardUser]
  );

  const loginAdmin = useCallback((user: AuthUser, token?: string) => {
    writeToStorage(STORAGE_KEYS.ADMIN_USER, user);
    if (token) {
      window.localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, token);
      setTokens((prev) => ({ ...prev, admin: token }));
      document.cookie = `admin_access_token=${token}; path=/; max-age=604800; samesite=lax`;
    }
    setAdminUser(user);
  }, []);

  const loginDashboard = useCallback((user: AuthUser, token?: string) => {
    writeToStorage(STORAGE_KEYS.DASHBOARD_USER, user);
    if (token) {
      window.localStorage.setItem(STORAGE_KEYS.DASHBOARD_TOKEN, token);
      setTokens((prev) => ({ ...prev, dashboard: token }));
      document.cookie = `dashboard_access_token=${token}; path=/; max-age=604800; samesite=lax`;
    }
    setDashboardUser(user);
  }, []);

  const updateAdminUser = useCallback((partial: Partial<AuthUser>) => {
    setAdminUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...partial };
      writeToStorage(STORAGE_KEYS.ADMIN_USER, updated);
      return updated;
    });
  }, []);

  const updateDashboardUser = useCallback((partial: Partial<AuthUser>) => {
    setDashboardUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...partial };
      writeToStorage(STORAGE_KEYS.DASHBOARD_USER, updated);
      return updated;
    });
  }, []);

  // ── Logout helpers ────────────────────────────────────────────────────────
  // We MUST await the server logout call because the backend clears the
  // HttpOnly cookies (admin_access_token / dashboard_access_token) server-side.
  // If we redirect before the server responds, the proxy still sees valid
  // cookies and won't redirect to login.

  const logoutAdmin = useCallback(async () => {
    try { await authService.logout(); } catch { /* ignore */ }
    clearFromStorage([STORAGE_KEYS.ADMIN_TOKEN, STORAGE_KEYS.ADMIN_USER]);
    document.cookie = 'admin_access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    window.location.replace(ROUTES.LOGIN);
  }, []);

  const logoutDashboard = useCallback(async () => {
    try { await dashboardAuthService.logout(); } catch { /* ignore */ }
    clearFromStorage([
      STORAGE_KEYS.DASHBOARD_TOKEN,
      STORAGE_KEYS.DASHBOARD_USER,
    ]);
    document.cookie = 'dashboard_access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    window.location.replace(ROUTES.DASHBOARD_LOGIN);
  }, []);

  const logoutAll = useCallback(async () => {
    try { await authService.logout(); } catch { /* ignore */ }
    try { await dashboardAuthService.logout(); } catch { /* ignore */ }
    clearFromStorage([
      STORAGE_KEYS.ADMIN_TOKEN,
      STORAGE_KEYS.ADMIN_USER,
      STORAGE_KEYS.DASHBOARD_TOKEN,
      STORAGE_KEYS.DASHBOARD_USER,
    ]);
    document.cookie = 'admin_access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    document.cookie = 'dashboard_access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    window.location.replace(ROUTES.LOGIN);
  }, []);

  const getToken = useCallback(
    (role: NonNullable<AuthRole>) => {
      if (role === 'admin') return tokens.admin ?? null;
      return tokens.dashboard ?? null;
    },
    [tokens]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      adminUser,
      dashboardUser,
      tokens,
      isAuthenticated,
      isLoading,
      loginAdmin,
      loginDashboard,
      logoutAdmin,
      logoutDashboard,
      logoutAll,
      updateAdminUser,
      updateDashboardUser,
      getToken,
    }),
    [
      adminUser,
      dashboardUser,
      tokens,
      isAuthenticated,
      isLoading,
      loginAdmin,
      loginDashboard,
      logoutAdmin,
      logoutDashboard,
      logoutAll,
      updateAdminUser,
      updateDashboardUser,
      getToken,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used within an <AuthProvider />');
  }
  return ctx;
}

export { STORAGE_KEYS as AUTH_STORAGE_KEYS };
