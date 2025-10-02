import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/src/middleware';

export async function GET(req: NextRequest) {
  const auth = await authenticateToken(req);
  if (auth instanceof NextResponse) {
    return auth; // error response from authenticateToken
  }
  return NextResponse.json({ user: auth });
}