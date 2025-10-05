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
  try {
    const authResult = await authenticateToken(request);
    if (authResult instanceof NextResponse) return authResult;
    if (!authResult || (authResult.role !== 'client' && authResult.role !== 'manager')) {
      return NextResponse.json({ message: 'Insufficient permissions' }, { status: 403 });
    }

    const propertyIdNum = Number(params.id);
    if (Number.isNaN(propertyIdNum)) {
      return NextResponse.json({ message: 'Invalid property id' }, { status: 400 });
    }

    const formData = await request.formData();
    const files = formData.getAll('photos').filter(f => f instanceof File) as File[];

    if (!files.length) {
      return NextResponse.json({ message: 'No files were uploaded' }, { status: 400 });
    }

    // Enforce max files and size per request to protect memory (e.g., 6 images * 5MB)
    const MAX_FILES = 6;
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED = new Set(['image/jpeg','image/png','image/webp']);

    const selected = files.slice(0, MAX_FILES);
    const uploaded: string[] = [];

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    try { await fs.mkdir(uploadsDir, { recursive: true }); } catch {}

    for (const file of selected) {
      if (!ALLOWED.has(file.type)) continue;
      if (file.size > MAX_SIZE) continue;

      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.name) || '.dat';
      const filename = `photo-${uniqueSuffix}${ext}`;
      const filePath = path.join(uploadsDir, filename);

      // Convert to Buffer (Note: Edge runtimes differ; here standard Node assumed)
      const arrayBuf = await file.arrayBuffer();
      await fs.writeFile(filePath, Buffer.from(arrayBuf));

      await prismaClient.propertyPhoto.create({
        data: { propertyId: propertyIdNum, photoUrl: `/uploads/${filename}` }
      });
      uploaded.push(filename);
    }

    if (!uploaded.length) {
      return NextResponse.json({ message: 'No valid files were uploaded' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Photos uploaded successfully', files: uploaded }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/property/[propertyId]/photos:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}