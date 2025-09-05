import {NextResponse } from 'next/server';
import { prismaClient } from '@/database';
// import { authenticateToken } from '@/src/middleware';

export async function GET() {
  try {
    console.log("000")
    // const authResult = await authenticateToken(request);
    // if (authResult instanceof NextResponse) return authResult;
    console.log("111")
    const properties = await prismaClient.property.findMany({
      where: { status: 'approved' },
      orderBy: { createdAt: 'desc' },
      include: { photos: true }
    });
    console.log("222")
    return NextResponse.json(
      { properties },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /api/properties:', error);
    return NextResponse.json(
      { 
        message: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}