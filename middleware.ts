import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith('/login');

    // Redirect authenticated users away from auth pages
    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      return null;
    }

    // Redirect unauthenticated users to login
    if (req.nextUrl.pathname.startsWith('/dashboard') && !isAuth) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return null;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Public routes that don't require authentication
        const publicPaths = ['/login', '/verify', '/'];
        if (publicPaths.includes(req.nextUrl.pathname)) {
          return true;
        }

        // Protected routes require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    // Protected routes that require authentication
    '/dashboard/:path*',

    // Auth routes
    '/login',

    // Exclude all static files, api routes, and certain public paths
    '/((?!api|_next/static|_next/image|favicon.ico|assets|webfonts).*)',
  ],
};