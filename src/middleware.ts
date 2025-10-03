import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import jwt from 'jsonwebtoken';

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || '123');

export async function authenticateToken(req: NextRequest) {
  const pathname = new URL(req.url).pathname;
  const publicRoutes = [
    "/api/auth/register", 
    "/api/auth/login", 
    "/api/branch", 
    "/api/properties/all",
    "/api/auth/signin",
    "/api/auth/callback",
    "/api/auth/session",
    "/api/auth/providers",
    "/api/auth/csrf",
    "/api/auth/manual/send-code",
    "/api/auth/manual/verify-code",
    "/api/auth/manual/login",
    "/api/health",
    "/api/debug"
  ];

  if (publicRoutes.includes(pathname) || pathname.startsWith("/api/auth/")) {
    return NextResponse.next(); 
  }

  // Prefer HttpOnly cookie over header
  let token = req.cookies.get('token')?.value || '';
  if (!token) {
    const authHeader = req.headers.get('Authorization') || "";
    token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : '';
  }

  if (!token) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  try {
    // Try to verify with jose first (for existing tokens)
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      const user = payload as { id: number; role: string; branch_id: number };
      return user;
    } catch {
      // If jose fails, try with jsonwebtoken (for manual auth tokens)
      const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || '123') as {
        userId?: number;
        id?: number;
        role: string;
        branchId?: number;
        email: string;
      };
      
      // Transform the payload to match expected format
      return {
        id: decoded.userId || decoded.id || 0,
        role: decoded.role,
        branch_id: decoded.branchId || null,
        email: decoded.email
      };
    }
  } catch {
    return NextResponse.json({ message: 'Invalid or expired token' }, { status: 403 });
  }
}

export function authorizeRole(roles: string[]) {
  return async function (req: NextRequest) {
    const user = await authenticateToken(req);

    if (user instanceof NextResponse) {
        return user;
    }
    
    if (!roles.includes(user.role)) {
        return NextResponse.json({ message: 'Insufficient permissions' }, { status: 403 });
    }
    
    return user; 
  };
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  
  // Allow NextAuth routes to pass through
  if (pathname.startsWith("/api/auth/")) {
    return NextResponse.next();
  }
  
  const publicRoutes = [
    "/api/auth/register", 
    "/api/auth/login", 
    "/api/branch", 
    "/api/properties/all",
    "/api/branches" // Allow GET access to branches for public viewing
  ];
  
  // Allow GET requests to branches (viewing), but protect POST (creation)
  if (pathname === "/api/branches" && req.method === "GET") {
    return NextResponse.next();
  }
  
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  const authResult = await authenticateToken(req);
  if (authResult instanceof NextResponse) {
    return authResult; 
  }

  const roleBasedRoutes: { [key: string]: string[] } = {
    "/api/notification": ["client", "manager", "owner" ,"assistant"],
    "/api/client": ["client"],
    "/api/properties": ["client", "manager" ,"assistant"],
    "/api/profile": ["client", "manager", "assistant", "owner"],
  };

  for (const route in roleBasedRoutes) {
    if (pathname.startsWith(route)) {
      const authResponse = await authorizeRole(roleBasedRoutes[route])(req);
      if (authResponse instanceof NextResponse) {
        return authResponse;
      }
    }
  }

  return NextResponse.next();
}

// Apply Middleware to API Routes
export const config = {
  matcher: "/api/:path*",
};
