import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Debug log removed

  // Define public routes that should NOT require authentication
  const publicRoutes = [
    "/api/health",
    "/api/debug", 
    "/api/status",
    "/api/simple",
    "/api/auth",
    "/api/auth/register",
    "/api/auth/login",
    "/api/branch",
    "/api/properties/all",
    "/api/branches"
  ];

  // Allow all NextAuth routes
  if (pathname.startsWith("/api/auth/")) {
  // Allowing NextAuth route
    return NextResponse.next();
  }

  // Allow specific public routes
  if (publicRoutes.includes(pathname)) {
  // Allowing public route
    return NextResponse.next();
  }

  // Allow GET requests to branches
  if (pathname === "/api/branches" && req.method === "GET") {
  // Allowing GET to branches
    return NextResponse.next();
  }

  // Checking authentication

  // Check for authentication token
  let token = req.cookies.get('token')?.value || '';
  if (!token) {
    const authHeader = req.headers.get('Authorization') || "";
    token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : '';
  }

  if (!token) {
  // No token found for this route
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  // Token found, allowing
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*']
};