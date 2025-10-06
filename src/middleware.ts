import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/src/lib/auth';

interface SessionUserLike {
  id?: string | number;
  role?: string | null;
  branchId?: number | null;
  email?: string | null;
}

// Legacy manual JWT removed; only NextAuth session is authoritative.

// authenticateToken now returns:
// - null for public/unauthenticated allowed routes
// - { id, role, branch_id, email? } for valid tokens
// - throws NextResponse (returned) only when unauthorized/invalid
export async function authenticateToken(req: NextRequest) {
  const pathname = new URL(req.url).pathname;
  const publicRoutes = [
    "/api/auth/register", 
    "/api/auth/login", 
    "/api/branch", 
    "/api/properties/all",
    "/api/auth/status",
    "/api/auth/complete",
    "/api/auth/signin",
    "/api/auth/callback",
    "/api/auth/session",
    "/api/auth/providers",
    "/api/auth/csrf",
    "/api/auth/manual/send-code",
    "/api/auth/manual/verify-code",
    "/api/auth/manual/login"
  ];

  if (publicRoutes.includes(pathname) || pathname.startsWith("/api/auth/")) {
    return null; 
  }

  // Use NextAuth session (Google or credentials)
  try {
    const session = await auth();
    if (session?.user && (session.user as SessionUserLike).id) {
      const su = session.user as SessionUserLike;
      return {
        id: Number(su.id),
        role: su.role || 'client',
        branch_id: su.branchId ?? null,
        email: su.email || undefined
      };
    }
  } catch {
    // ignore, will return 401 below
  }

  return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  
  // Debug logs removed for production performance.
  
  // Allow NextAuth routes to pass through
  if (pathname.startsWith("/api/auth/")) {
  // Allowing NextAuth route
    return NextResponse.next();
  }
  
  const publicRoutes = [
    "/api/auth/register", 
    "/api/auth/login", 
    "/api/branch", 
    "/api/properties/all",
    "/api/branches", // Allow GET access to branches for public viewing
    "/api/auth/status",
    "/api/auth/complete",
    "/api/auth/manual/login",
    "/api/auth/manual/send-code",
    "/api/auth/manual/verify-code"
  ];
  
  // Allow GET requests to branches (viewing), but protect POST (creation)
  if (pathname === "/api/branches" && req.method === "GET") {
  // Allow GET to branches
    return NextResponse.next();
  }
  
  // Allow access to view all properties publicly
  if (pathname === "/api/properties/all" && req.method === "GET") {
  // Allow GET to properties/all
    return NextResponse.next();
  }
  
  // Allow access to individual property details publicly  
  if (pathname.match(/^\/api\/properties\/\d+$/) && req.method === "GET") {
  // Allow GET to individual property
    return NextResponse.next();
  }
  
  if (publicRoutes.includes(pathname)) {
  // Public route allowed
    return NextResponse.next();
  }

  // Enforce NextAuth session for protected routes
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*']
};