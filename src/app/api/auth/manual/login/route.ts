import { NextResponse } from 'next/server';

// Legacy manual login disabled: use NextAuth credentials provider.
export async function POST() {
  return NextResponse.json({
    message: 'Manual login endpoint deprecated. Use NextAuth credentials via signIn(\'credentials\').',
    deprecated: true
  }, { status: 410 });
}

export async function GET() {
  return POST();
}
