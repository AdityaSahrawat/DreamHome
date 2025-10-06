import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/src/lib/auth';
import { authenticateToken } from '@/src/middleware';

// Backwards compatibility endpoint; mirrors /api/auth/status output
export async function GET(req: NextRequest) {
    try {
        const session = await auth();
        if (session?.user) {
            return NextResponse.json({
                authenticated: true,
                source: 'nextauth',
                user: {
                    id: session.user.id,
                    email: session.user.email,
                    name: session.user.name,
                    role: (session.user as { role?: string }).role || null,
                }
            });
        }
        const manual = await authenticateToken(req);
        if (manual && !(manual instanceof NextResponse)) {
            return NextResponse.json({ authenticated: true, source: 'jwt', user: manual });
        }
        if (manual instanceof NextResponse) return manual;
        return NextResponse.json({ authenticated: false, source: 'none' });
    } catch (error) {
        console.error('Error in /api/auth proxy:', error);
        return NextResponse.json({ authenticated: false, source: 'error' }, { status: 500 });
    }
}