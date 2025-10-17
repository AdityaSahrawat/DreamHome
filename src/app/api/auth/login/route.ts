import { NextResponse } from 'next/server';

// Deprecated endpoint: clients should use /api/auth/manual/login or Google OAuth via NextAuth.
export async function POST() {
  return NextResponse.json(
    {
      message: 'This endpoint is deprecated. Use /api/auth/manual/login or Google OAuth.',
      deprecated: true,
      replacement: '/api/auth/manual/login'
    },
    { status: 410 }
  );
}