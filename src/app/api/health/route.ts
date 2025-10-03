import { NextResponse } from 'next/server';
import { prismaClient } from '../../../../database/index';

const prisma = prismaClient;

export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    // Check environment variables
    const requiredEnvVars = [
      'DATABASE_URL',
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL',
      'GOOGLE_CLIENT_ID',
      'GOOGLE_CLIENT_SECRET'
    ];
    
    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || 'unknown',
      environment: process.env.NODE_ENV || 'unknown',
      database: 'connected',
      environment_variables: missingEnvVars.length === 0 ? 'configured' : 'missing_variables',
      missing_env_vars: missingEnvVars.length > 0 ? missingEnvVars : undefined
    };
    
    const statusCode = missingEnvVars.length > 0 ? 503 : 200;
    
    return NextResponse.json(healthStatus, { status: statusCode });
    
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 503 });
  } finally {
    await prisma.$disconnect();
  }
}