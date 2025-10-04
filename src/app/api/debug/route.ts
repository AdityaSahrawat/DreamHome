export async function GET() {
  return Response.json({
    timestamp: new Date().toISOString(),
    env: {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'MISSING',
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'MISSING',
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'MISSING',
      DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'MISSING',
      EMAIL_USER: process.env.EMAIL_USER ? 'SET' : 'MISSING',
      EMAIL_PASS: process.env.EMAIL_PASS ? 'SET' : 'MISSING',
      NODE_ENV: process.env.NODE_ENV,
    },
    headers: {
      host: process.env.NEXTAUTH_URL || 'localhost:3000'
    }
  });
}