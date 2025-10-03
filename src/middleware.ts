import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import jwt from 'jsonwebtoken';
import { rateLimit, validateContentLength, addSecurityHeaders } from './lib/security';

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET environment variable is required');
}

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);

// Configure rate limiting for different routes
const apiRateLimit = rateLimit({ windowMs: 15 * 60 * 1000, maxRequests: 100 }); // 100 requests per 15 minutes
const authRateLimit = rateLimit({ windowMs: 15 * 60 * 1000, maxRequests: 5 }); // 5 auth attempts per 15 minutes

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
    "/api/auth/manual/login"
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
      const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as {
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
  
  // Apply rate limiting
  if (pathname.startsWith("/api/auth/")) {
    const rateLimitResult = authRateLimit(req);
    if (rateLimitResult) return rateLimitResult;
  } else if (pathname.startsWith("/api/")) {
    const rateLimitResult = apiRateLimit(req);
    if (rateLimitResult) return rateLimitResult;
  }
  
  // Validate content length for POST/PUT requests
  if (req.method === 'POST' || req.method === 'PUT') {
    const contentLengthResult = validateContentLength(5 * 1024 * 1024)(req); // 5MB limit
    if (contentLengthResult) return contentLengthResult;
  }
  
  // Allow NextAuth routes to pass through
  if (pathname.startsWith("/api/auth/")) {
    const response = NextResponse.next();
    return addSecurityHeaders(response);
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

  const response = NextResponse.next();
  return addSecurityHeaders(response);
}

// Apply Middleware to API Routes
export const config = {
  matcher: "/api/:path*",
};
