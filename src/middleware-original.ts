import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  console.log(`🔍 Middleware processing: ${pathname}`);

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
    console.log(`✅ Allowing NextAuth route: ${pathname}`);
    return NextResponse.next();
  }

  // Allow specific public routes
  if (publicRoutes.includes(pathname)) {
    console.log(`✅ Allowing public route: ${pathname}`);
    return NextResponse.next();
  }

  // Allow GET requests to branches
  if (pathname === "/api/branches" && req.method === "GET") {
    console.log(`✅ Allowing GET to branches: ${pathname}`);
    return NextResponse.next();
  }

  console.log(`🔒 Checking authentication for: ${pathname}`);

  // Check for authentication token
  let token = req.cookies.get('token')?.value || '';
  if (!token) {
    const authHeader = req.headers.get('Authorization') || "";
    token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : '';
  }

  if (!token) {
    console.log(`❌ No token found for: ${pathname}`);
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  console.log(`✅ Token found, allowing: ${pathname}`);
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*']
};