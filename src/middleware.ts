import {NextResponse} from 'next/server';
import {auth} from '@/auth';
import {isAdminEmail} from '@/lib/admin-access';

/**
 * Protect /admin/* behind Google SSO + allowlist.
 * /admin/login is reachable without a session so Paul can sign in.
 * Exact `/admin` is the twin Process Instrument face (F7) — layout skips SideNav.
 */
export default auth((req) => {
  const {pathname} = req.nextUrl;
  const isLogin = pathname === '/admin/login';
  const email = req.auth?.user?.email ?? null;
  const allowed = Boolean(email && isAdminEmail(email));

  if (isLogin) {
    if (allowed) {
      return NextResponse.redirect(new URL('/admin', req.nextUrl.origin));
    }
    return NextResponse.next();
  }

  if (!allowed) {
    const login = new URL('/admin/login', req.nextUrl.origin);
    login.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(login);
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-pathname', pathname);
  if (pathname === '/admin') {
    requestHeaders.set('x-ag-admin-twin', '1');
  }

  return NextResponse.next({
    request: {headers: requestHeaders},
  });
});

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
