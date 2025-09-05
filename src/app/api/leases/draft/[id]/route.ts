// app/api/leases/draft/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/database';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const draftId = params.id;
    

    const draft = await prismaClient.leaseDraft.findUnique({
      where: { id: Number(draftId) }
    });

    if (!draft) {
      return NextResponse.json(
        { message: 'Draft not found' },
        { status: 404 }
      );
    }

    // Parse terms if stored as string
    const terms = typeof draft.currentTerms === 'string' 
      ? JSON.parse(draft.currentTerms)
      : draft.currentTerms;

    return NextResponse.json({
      ...draft,
      current_terms: terms
    });
  } catch {
    return NextResponse.json(
      { message: 'Failed to fetch draft' },
      { status: 500 }
    );
  }
}