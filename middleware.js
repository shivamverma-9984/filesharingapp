import { NextResponse } from "next/server";

export function middleware(request) {
  // Skip middleware for login/register pages and their API route
  const path = request.nextUrl.pathname;
  const isPublicPath =path === "/login" || path == "/register" || path==="/"
  const token = request.cookies.get("token")?.value;
  if (isPublicPath && token) 
    {
      return NextResponse.redirect(new URL(path, request.url));
    }
     if (!isPublicPath && !token) {
      // For API requests, return 401
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }


// Add the paths that you want to protect here
export const config = {
  matcher: ["/dashboard", '/files','/upload'],
};
