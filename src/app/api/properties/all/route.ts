import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/database/db';
import { authenticateToken } from '@/src/middleware';

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateToken(request);
    if (authResult instanceof NextResponse) return authResult;

    const properties = await query('SELECT * FROM properties WHERE status = "approved" ORDER BY created_at DESC') as any[]
    
    const photos = await query('SELECT property_id, photo_url FROM property_photos') as any[]
    
    const photosByProperty: Record<string, string[]> = {};
    photos.forEach((photo: any) => {
      if (!photosByProperty[photo.property_id]) {
        photosByProperty[photo.property_id] = [];
      }
      photosByProperty[photo.property_id].push(photo.photo_url);
    });

    const propertiesWithPhotos = properties.map((property: any) => ({
      ...property,
      photos: photosByProperty[property.id] || []
    }));

    return NextResponse.json(
      { 
        properties: propertiesWithPhotos 
      },
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