import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/src/lib/auth';
import jwt from 'jsonwebtoken';

const REQUIRED_SECRET = process.env.NEXTAUTH_SECRET;

interface ManualTokenPayload {
  id?: number | string;
  userId?: number | string;
  email?: string;
  name?: string;
  role?: string | null;
  branchId?: number | null;
  [key: string]: unknown;
}

function verifyManualToken(raw?: string) {
  if (!raw || !REQUIRED_SECRET) return null;
  try {
    const decoded = jwt.verify(raw, REQUIRED_SECRET) as ManualTokenPayload;
    return {
      id: decoded.userId || decoded.id || null,
      email: decoded.email || null,
      name: decoded.name || null,
      role: decoded.role ?? null,
      branchId: decoded.branchId ?? null,
    };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    if (!REQUIRED_SECRET) {
      return NextResponse.json({ authenticated: false, source: 'error', message: 'Server auth secret misconfigured' }, { status: 500 });
    }

    // Prefer NextAuth session
    const session = await auth();
    if (session?.user) {
      return NextResponse.json({
        authenticated: true,
        source: 'nextauth',
        user: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          role: (session.user as { role?: string } | undefined)?.role || null,
          branchId: (session.user as { branchId?: number | null } | undefined)?.branchId ?? null,
        }
      });
    }

    // Manual JWT fallback
    const bearer = req.headers.get('Authorization');
    const rawToken = bearer?.startsWith('Bearer ') ? bearer.split(' ')[1] : (req.cookies.get('token')?.value || undefined);
    const manual = verifyManualToken(rawToken);
    if (manual?.id) {
      return NextResponse.json({ authenticated: true, source: 'jwt', user: manual });
    }

    return NextResponse.json({ authenticated: false, source: 'none' });
  } catch (e) {
    console.error('auth/status error', e);
    return NextResponse.json({ authenticated: false, source: 'error' }, { status: 500 });
  }
}