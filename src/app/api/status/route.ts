export async function GET() {
  try {
    // Test database connection
    const { prismaClient } = await import('@/database')
    await prismaClient.$connect()
    
    return Response.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: 'Connected',
      auth: {
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'MISSING',
        NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NOT_SET',
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'MISSING',
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'MISSING',
      }
    })
  } catch (error) {
    return Response.json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      database: 'Failed to connect'
    }, { status: 500 })
  }
}