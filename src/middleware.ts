import { NextRequest, NextResponse } from 'next/server';
import jwt from "jsonwebtoken"
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode('123');

export async function authenticateToken(req: NextRequest) {
  const authHeader = req.headers.get('Authorization') || "";
  const token = authHeader.split(' ')[0];
  const publicRoutes = ["/api/auth/register", "/api/auth/login"];
  const protectedRoutes = ["/api/notification","/api/properties","/api/payment" ];

  if (publicRoutes.includes(new URL(req.url).pathname)) {
    return NextResponse.next(); 
  }
  if (protectedRoutes.includes(new URL(req.url).pathname) && !token) {
    return NextResponse.json({ message: "Authentication required" }, { status: 401 });
  }

  if (!token) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const user = payload as { id: number; role: string; branch_id: number };
    console.log(user)
    return user;
  } catch (error) {
    console.log(error)
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
    "/api/notification": ["client", "manager" , "owner"], 
    "/api/notification/[id]": ["client" , "owner" , "manager"], 
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
