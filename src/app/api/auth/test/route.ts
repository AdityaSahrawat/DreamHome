import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  
  return Response.json({
    message: 'Auth test endpoint is working',
    timestamp: new Date().toISOString(),
    pathname: url.pathname,
    fullUrl: req.url,
    method: req.method,
    headers: {
      authorization: req.headers.get('authorization'),
      cookie: req.headers.get('cookie'),
      userAgent: req.headers.get('user-agent')
    },
    middleware_status: 'successfully bypassed'
  });
}