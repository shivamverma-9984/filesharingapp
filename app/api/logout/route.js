import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Logged out' }, { status: 200 });

  // Clear cookies
  response.cookies.set('token', '', { path: '/', maxAge: 0 });
  response.cookies.set('userEmail', '', { path: '/', maxAge: 0 });

  return response;
}
