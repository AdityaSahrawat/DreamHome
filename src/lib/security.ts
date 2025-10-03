import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiter (for production, use Redis or external service)
const rateLimitStore = new Map<string, { count: number; lastReset: number }>();

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
}

export function rateLimit(config: RateLimitConfig) {
  return (req: NextRequest): NextResponse | null => {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const now = Date.now();
    const key = `${ip}:${req.nextUrl.pathname}`;
    
    const record = rateLimitStore.get(key);
    
    if (!record || now - record.lastReset > config.windowMs) {
      // Reset the counter
      rateLimitStore.set(key, { count: 1, lastReset: now });
      return null; // Allow request
    }
    
    if (record.count >= config.maxRequests) {
      // Rate limit exceeded
      return new NextResponse(
        JSON.stringify({ 
          error: 'Too Many Requests',
          message: 'You have exceeded the request limit. Please try again later.',
          retryAfter: Math.ceil((config.windowMs - (now - record.lastReset)) / 1000)
        }),
        { 
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil((config.windowMs - (now - record.lastReset)) / 1000).toString(),
          }
        }
      );
    }
    
    // Increment counter
    record.count += 1;
    return null; // Allow request
  };
}

export function validateContentLength(maxSize: number = 1024 * 1024) { // Default 1MB
  return (req: NextRequest): NextResponse | null => {
    const contentLength = req.headers.get('content-length');
    
    if (contentLength && parseInt(contentLength) > maxSize) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'Payload Too Large',
          message: `Request body exceeds maximum size of ${maxSize} bytes`,
          maxSize
        }),
        { 
          status: 413,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    return null; // Allow request
  };
}

export function addSecurityHeaders(response: NextResponse): NextResponse {
  // Add additional security headers that aren't in next.config.ts
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  return response;
}