import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/database';

export async function POST(req: NextRequest) {
  try {
    const { draft_id } = await req.json();

    // 1. Get the draft with property and agent information
    const draft = await prismaClient.leaseDraft.findUnique({
      where: { id: draft_id },
      include: {
        property: {
          select: { agentId: true, id: true }
        }
      }
    });

    if (!draft) {
      return NextResponse.json(
        { message: 'Draft not found' },
        { status: 404 }
      );
    }

    // 2. Create the final lease
    const terms = draft.currentTerms as Record<string, unknown>;
    const dates = terms?.dates as Record<string, unknown>;
    const startDate = dates?.start as string;
    
    const lease = await prismaClient.lease.create({
      data: {
        draftId: draft_id,
        finalTerms: draft.currentTerms as object,
        activeFrom: startDate ? new Date(startDate) : new Date(),
        signedByClient: false,
        signedByAgent: false
      }
    });

    // 3. Update property status to 'rented'
    await prismaClient.property.update({
      where: { id: draft.property.id },
      data: { status: 'rented' }
    });

    // 4. Update draft status to 'signed'
    await prismaClient.leaseDraft.update({
      where: { id: draft_id },
      data: { status: 'signed' }
    });

    return NextResponse.json(
      { 
        lease_id: lease.id,
        message: 'Lease finalized successfully'
      },
      { status: 201 }
    );

  } catch (error: unknown) {
    console.error('Finalize lease error:', error);
    return NextResponse.json(
      { 
        message: 'Failed to finalize lease',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}