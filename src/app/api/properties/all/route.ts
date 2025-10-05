import {NextResponse } from 'next/server';
import { prismaClient } from '@/database';
// import { authenticateToken } from '@/src/middleware';

export async function GET() {
  try {
  // Removed debug log marker
    // const authResult = await authenticateToken(request);
    // if (authResult instanceof NextResponse) return authResult;
  // Removed debug log marker
    const properties = await prismaClient.property.findMany({
      where: { status: 'approved' },
      orderBy: { createdAt: 'desc' },
      include: { photos: true }
    });
    
    // Transform the data to match the expected format
    const transformedProperties = properties.map(property => ({
      id: property.id,
      title: property.title,
      description: property.description,
      price: property.price,
      address: property.address,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.sqft,
      type: 'House', // Default type for now until migration is complete
      photos: property.photos.map(photo => photo.photoUrl),
      created_at: property.createdAt
    }));
    
  // Removed debug log marker
    return NextResponse.json(
      { properties: transformedProperties },
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