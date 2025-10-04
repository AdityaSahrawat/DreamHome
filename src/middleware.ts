import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  
  // Log EVERYTHING for debugging
  console.log('=== MIDDLEWARE DEBUG ===');
  console.log('Pathname:', pathname);
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  
  // For now, let ALL API routes through without authentication
  if (pathname.startsWith('/api/')) {
    console.log('✅ ALLOWING ALL API ROUTES FOR DEBUG');
    return NextResponse.next();
  }
  
  console.log('Not an API route, passing through');
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*']
};