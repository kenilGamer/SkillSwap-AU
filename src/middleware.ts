import { NextResponse, NextRequest } from 'next/server';

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;


    if (pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname.startsWith('/api/auth') || pathname.startsWith('/_next') || pathname.startsWith('/static')) {
        return NextResponse.next();
    }

    const isLoggedIn = request.cookies.get('next-auth.session-token') || request.cookies.get('__Secure-next-auth.session-token');

    if (!isLoggedIn) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}