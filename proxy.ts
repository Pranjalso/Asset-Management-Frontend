import { type NextRequest, NextResponse } from 'next/server';

const ADMIN_TOKEN_KEY = 'admin_access_token';
const DASHBOARD_TOKEN_KEY = 'dashboard_access_token';

const ADMIN_ROOT = '/dashboard';
const COMPANY_ROOT = '/company-dashboard';
const ADMIN_LOGIN = '/';
const DASHBOARD_LOGIN = '/dashboard-login';

const ADMIN_HOME = '/dashboard/company-user';
const COMPANY_HOME = '/company-dashboard';

function parseCookieHeader(cookieHeader: string | null): Record<string, string> {
  const out: Record<string, string> = {};
  if (!cookieHeader) return out;
  cookieHeader.split(';').forEach((pair) => {
    const idx = pair.indexOf('=');
    if (idx === -1) return;
    const key = pair.slice(0, idx).trim();
    const value = pair.slice(idx + 1).trim();
    try {
      out[key] = decodeURIComponent(value);
    } catch {
      out[key] = value;
    }
  });
  return out;
}

function isAdminPath(pathname: string): boolean {
  return pathname === ADMIN_ROOT || pathname.startsWith(`${ADMIN_ROOT}/`);
}

function isCompanyPath(pathname: string): boolean {
  return pathname === COMPANY_ROOT || pathname.startsWith(`${COMPANY_ROOT}/`);
}

function isPublicAuthPath(pathname: string): boolean {
  return (
    pathname === ADMIN_LOGIN ||
    pathname === DASHBOARD_LOGIN ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/Image/') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/api/')
  );
}

function getCookie(req: NextRequest, key: string): string | undefined {
  const direct = req.cookies.get(key)?.value;
  if (direct) return direct;
  const all = parseCookieHeader(req.headers.get('cookie'));
  return all[key];
}

export function proxy(req: NextRequest) {
  const { nextUrl } = req;
  const { pathname, search } = nextUrl;

  const adminToken = getCookie(req, ADMIN_TOKEN_KEY);
  const dashboardToken = getCookie(req, DASHBOARD_TOKEN_KEY);

  const hasAdmin = !!adminToken;
  const hasDashboard = !!dashboardToken;

  if (isPublicAuthPath(pathname)) {
    if (pathname === ADMIN_LOGIN && hasAdmin) {
      const url = nextUrl.clone();
      url.pathname = ADMIN_HOME;
      url.search = '';
      return NextResponse.redirect(url);
    }
    if (pathname === DASHBOARD_LOGIN && hasDashboard) {
      const url = nextUrl.clone();
      url.pathname = COMPANY_HOME;
      url.search = '';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (isAdminPath(pathname)) {
    if (!hasAdmin) {
      const url = nextUrl.clone();
      url.pathname = ADMIN_LOGIN;
      const target = `${pathname}${search || ''}`;
      url.search = target === ADMIN_HOME ? '' : `?redirect=${encodeURIComponent(target)}`;
      return NextResponse.redirect(url);
    }
    if (pathname === ADMIN_ROOT) {
      const url = nextUrl.clone();
      url.pathname = ADMIN_HOME;
      url.search = '';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (isCompanyPath(pathname)) {
    if (!hasDashboard) {
      const url = nextUrl.clone();
      url.pathname = DASHBOARD_LOGIN;
      const target = `${pathname}${search || ''}`;
      url.search = target === COMPANY_HOME ? '' : `?redirect=${encodeURIComponent(target)}`;
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|Image|api).*)',
  ],
};
