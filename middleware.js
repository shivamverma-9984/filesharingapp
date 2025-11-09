// import { NextResponse } from "next/server";

// export function middleware(request) {
//   // Skip middleware for login/register pages and their API route
//   const path = request.nextUrl.pathname;
//   const isPublicPath =path === "/login" || path == "/register" || path==="/"
//   const token = request.cookies.get("token")?.value;
//   if (isPublicPath && token) 
//     {
//       return NextResponse.redirect(new URL(path, request.url));
//     }
//      if (!isPublicPath && !token) {
//       // For API requests, return 401
//       return NextResponse.redirect(new URL("/login", request.url));
//     }
//     return NextResponse.next();
//   }



// // Add the paths that you want to protect here
// export const config = {
//   matcher: ["/dashboard", '/files','/upload'],
// };



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
