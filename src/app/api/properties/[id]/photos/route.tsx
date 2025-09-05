import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/database';
import { authenticateToken } from '@/src/middleware';
import path from 'path';
import { promises as fs } from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest,{ params }: { params: { id: string } }) {
    console.log("req came at [id]/photos")
  try {
    const authResult = await authenticateToken(request);
    if (authResult instanceof NextResponse) return authResult;
    if (authResult.role !== 'client' && authResult.role !== 'manager') {
      return NextResponse.json(
        { message: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const propertyId = params.id;
    console.log("id : ", propertyId)
    const formData = await request.formData();
    const files = formData.getAll('photos');
    console.log("files : " ,files)

    if (!files.length) {
      return NextResponse.json(
        { message: 'No files were uploaded' },
        { status: 400 }
      );
    }

    const uploadedFiles = [];
    for (const file of files) {
      if (file instanceof File) {
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        }

        if (file.size > 5 * 1024 * 1024) {
          continue; 
        }

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.name);
        const filename = `photo-${uniqueSuffix}${ext}`;
        const filePath = path.join(process.cwd(), 'public', 'uploads', filename);

        const buffer = await file.arrayBuffer();
        await fs.writeFile(filePath, Buffer.from(buffer));

        const photoUrl = `/uploads/${filename}`;
        await prismaClient.propertyPhoto.create({
          data: {
            propertyId: parseInt(propertyId),
            photoUrl: photoUrl
          }
        });

        uploadedFiles.push(filename);
      }
    }

    if (!uploadedFiles.length) {
      return NextResponse.json(
        { message: 'No valid files were uploaded' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Photos uploaded successfully',
        files: uploadedFiles 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/property/[propertyId]/photos:', error);
    return NextResponse.json(
      { 
        message: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}