const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface ScopedSession {
  scope: 'admin' | 'dashboard';
}

// API path prefixes that belong to the admin (super-admin) scope
const ADMIN_SCOPED_PREFIXES = [
  '/api/dashboard/companies',
  '/api/dashboard/employees',
  '/api/dashboard/admin',
  '/api/assets',
];

// API path prefixes that belong to the company-dashboard scope
const COMPANY_SCOPED_PREFIXES = [
  '/api/dashboard/auth',
  '/api/dashboard/org',
  '/api/dashboard/assets',
  '/api/dashboard/asset-ops',
  '/api/dashboard/stats',
  '/api/dashboard/usage',
  '/api/dashboard/notifications',
];

function getSessionScopeForPath(path: string): ScopedSession {
  if (ADMIN_SCOPED_PREFIXES.some((p) => path.startsWith(p))) {
    return { scope: 'admin' };
  }
  if (COMPANY_SCOPED_PREFIXES.some((p) => path.startsWith(p))) {
    return { scope: 'dashboard' };
  }

  const onCompanyPage =
    typeof window !== 'undefined' &&
    window.location.pathname.startsWith('/company-dashboard');

  return { scope: onCompanyPage ? 'dashboard' : 'admin' };
}

function buildHeaders(extra?: HeadersInit): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (extra) {
    Object.assign(headers, extra as Record<string, string>);
  }

  return headers;
}

function clearClientSession(scope: 'admin' | 'dashboard'): void {
  if (typeof window === 'undefined') return;

  if (scope === 'admin') {
    localStorage.removeItem('admin_user');
    document.cookie = 'admin_access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    document.cookie = 'admin_refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    document.cookie = 'admin_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  } else {
    localStorage.removeItem('dashboard_user');
    document.cookie = 'dashboard_access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    document.cookie = 'dashboard_refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    document.cookie = 'dashboard_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  }
}

function redirectToLogin(scope: 'admin' | 'dashboard'): void {
  if (typeof window === 'undefined') return;
  const loginPath = scope === 'admin' ? '/' : '/dashboard-login';
  const current = window.location.pathname;
  if (current !== loginPath && current !== '/') {
    window.history.replaceState(null, '', `${loginPath}?redirect=${encodeURIComponent(current)}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
}

async function tryRefresh(scope: 'admin' | 'dashboard'): Promise<boolean> {
  const refreshPath = scope === 'admin' ? '/api/auth/refresh' : '/api/dashboard/auth/refresh';

  const res = await fetch(`${BASE_URL}${refreshPath}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    clearClientSession(scope);
    return false;
  }

  const body = await res.json().catch(() => null);
  const user = body?.data?.user;
  if (typeof window !== 'undefined' && user) {
    const key = scope === 'admin' ? 'admin_user' : 'dashboard_user';
    localStorage.setItem(key, JSON.stringify(user));
  }

  return true;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  retryOn401 = true
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const scope = getSessionScopeForPath(path).scope;

  let res: Response;
  try {
    res = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: buildHeaders(options.headers),
    });
  } catch (err) {
    console.warn(`Network Error: ${options.method || 'GET'} ${path} ->`, err);
    throw new Error('Network error: Failed to connect to the server. Please ensure the backend is running.');
  }

  if (!res.ok) {
    if (res.status === 401 && retryOn401) {
      const refreshed = await tryRefresh(scope);
      if (refreshed) {
        return apiRequest<T>(path, options, false);
      }
      redirectToLogin(scope);
    }

    const errorBody = await res.json().catch(() => ({}) as Record<string, unknown>);
    let serverMessage =
      (errorBody as { error?: string; message?: string }).error ??
      (errorBody as { error?: string; message?: string }).message ??
      res.statusText;

    if (res.status === 401 && typeof serverMessage === 'string') {
      const normalizedMessage = serverMessage.trim().toLowerCase();
      if (normalizedMessage === 'user not found.' || normalizedMessage === 'user not found') {
        clearClientSession(scope);
        redirectToLogin(scope);
      }
    }

    if (res.status === 403 && typeof serverMessage === 'string') {
      const normalized = serverMessage.trim().toLowerCase();
      if (normalized === 'invalid session token.' || normalized === 'invalid session token') {
        clearClientSession(scope);
        redirectToLogin(scope);
      }
    }

    if (res.status === 404 && path.startsWith('/api/auth')) {
      serverMessage = 'Authentication API not found. Make sure the backend server is running on http://localhost:3000.';
    }

    // 401 on login/auth endpoints is expected (wrong credentials) — use warn to avoid alarming overlays
    const is401AuthEndpoint = res.status === 401 && (path.includes('/auth/login') || path.includes('/auth/company'));
    if (is401AuthEndpoint) {
      console.warn(`Auth Warning: ${options.method || 'GET'} ${path} -> ${res.status} - ${serverMessage}`);
    } else {
      console.error(`API Error: ${options.method || 'GET'} ${path} -> ${res.status} - ${serverMessage}`);
    }
    const apiError = new Error(serverMessage ?? 'Request failed') as Error & { statusCode?: number };
    apiError.statusCode = res.status;
    throw apiError;
  }

  return res.json() as Promise<T>;
}

export function getAvatarUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  if (url.startsWith('http')) return url;
  return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

export { BASE_URL };
