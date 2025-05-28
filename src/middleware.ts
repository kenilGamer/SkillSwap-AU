import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequestWithAuth } from 'next-auth/middleware';

// List of paths that don't require verification
const publicPaths = [
  '/login',
  '/signup',
  '/api/auth/verify-email',
  '/api/auth/resend-verification',
  '/auth/verify-success',
  '/auth/verify-pending',
];

export default async function middleware(request: NextRequestWithAuth) {
  const token = await getToken({ req: request });
  const path = request.nextUrl.pathname;

  // Allow public paths
  if (publicPaths.some(p => path.startsWith(p))) {
    return NextResponse.next();
  }

  // Check if user is authenticated
  if (!token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(url);
  }

  // Check if email verification is required
  if (token.verified === false) {
    return NextResponse.redirect(new URL('/auth/verify-pending', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};