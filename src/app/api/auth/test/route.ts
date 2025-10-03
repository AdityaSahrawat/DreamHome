export async function GET() {
  return Response.json({
    message: 'Auth endpoint is working',
    timestamp: new Date().toISOString(),
    pathname: '/api/auth',
    middleware_status: 'bypassed'
  });
}