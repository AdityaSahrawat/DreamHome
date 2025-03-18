import { NextRequest, NextResponse } from 'next/server';
import jwt from "jsonwebtoken"

const JWT_SECRET = "123";

export async function authenticateToken(req: NextRequest) {
  const authHeader = req.headers.get('authorization') || "";
  const token = authHeader.split(' ')[1];
  const publicRoutes = ["/api/auth/register", "/api/auth/login"];
  const protectedRoutes = ["/api/notification","/api/properties","/api/payment" ];


  if (publicRoutes.includes(new URL(req.url).pathname)) {
    return NextResponse.next(); // Allow request to continue
  }

  if (protectedRoutes.includes(new URL(req.url).pathname) && !token) {
    return NextResponse.json({ message: "Authentication required" }, { status: 401 });
  }

  if (!token) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  try {
    const user = jwt.verify(token, JWT_SECRET) as { id: number; role: string };
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
  const user = await authenticateToken(req);

  if (user instanceof NextResponse) {
    return user; 
  }

  const roleBasedRoutes: { [key: string]: string[] } = {
    "/api/auth": ["staff"],
    "/api/notification": ["client", "staff"], 
    "/api/client": ["client"], 
  };

  for (const route in roleBasedRoutes) {
    if (req.nextUrl.pathname.startsWith(route)) {
      const authResponse = await authorizeRole(roleBasedRoutes[route])(req);
      if (authResponse instanceof NextResponse) {
        return authResponse; // Return error if unauthorized
      }
    }
  }

  return NextResponse.next();
}

// ✅ Apply Middleware to API Routes
export const config = {
  matcher: "/api/:path*",
};
