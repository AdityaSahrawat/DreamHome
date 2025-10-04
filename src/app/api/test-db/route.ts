import { NextResponse } from 'next/server'
import { prismaClient } from '@/database'

export async function GET() {
  try {
    // Simple database connectivity test
    await prismaClient.$connect()
    
    // Try a simple query
    const result = await prismaClient.$queryRaw`SELECT 1 as test`
    
    await prismaClient.$disconnect()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      result 
    })
  } catch (error: unknown) {
    console.error('Database connection error:', error)
    
    return NextResponse.json({ 
      success: false, 
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}