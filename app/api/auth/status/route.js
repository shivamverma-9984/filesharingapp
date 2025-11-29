import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const userEmail = cookieStore.get('userEmail')?.value;

    if (!token || !userEmail) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }
    return NextResponse.json({ authenticated: true, userEmail }, { status: 200 });
  } catch (err) {
    console.error('auth status error', err);
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}
