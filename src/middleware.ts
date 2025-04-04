import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode('123');

export async function authenticateToken(req: NextRequest) {
  const pathname = new URL(req.url).pathname;
  const publicRoutes = ["/api/auth/register", "/api/auth/login"];

  // ✅ First check if it's a public route
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next(); 
  }

  // Proceed with auth for protected routes
  const authHeader = req.headers.get('Authorization') || "";
  const token = authHeader.split(' ')[1];

  if (!token) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const user = payload as { id: number; role: string; branch_id: number };
    return user;
  } catch (error) {
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
  
  const publicRoutes = ["/api/auth/register", "/api/auth/login" , "/api/branch"];
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
    // "/api/properties/all": ["client", "manager"],
    "/api/properties": ["client", "manager" ,"assistant"],
    "/api/profile": ["client", "manager" , "assistant"],
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

// ✅ Apply Middleware to API Routes
export const config = {
  matcher: "/api/:path*",
};
