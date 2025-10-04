export async function GET() {
  return Response.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: 'DreamHome API is running',
    version: '1.0.0'
  });
}