


import { NextResponse } from 'next/server';
import { verifyToken } from './app/lib/auth/verifyToken'; // optional if you want to decode

export function middleware(request) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('token')?.value;

  const isPublicPath = path === '/' || path === '/login' || path === '/register';

  // ✅ If user is logged in and tries to access public pages, redirect to dashboard
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // ❌ If user is not logged in and tries to access protected pages, redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/files/:path*', '/upload/:path*'],
};
