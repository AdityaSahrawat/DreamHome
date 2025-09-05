import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/database';
import { authenticateToken } from '@/src/middleware';



export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await authenticateToken(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { action } = await req.json(); // 'accept' or 'reject'
    const draft_id = params.id;

    // 1. Verify draft is in approved state

    const draft = await prismaClient.leaseDraft.findFirst({
      where: {
        id: Number(draft_id),
        status: 'approved'
      },
      include: { property: true }
    });


    if (!draft) {
      return NextResponse.json(
        { message: 'Draft not found or not approved' },
        { status: 404 }
      );
    }


    // 2. Type-safe terms parsing
    const terms = typeof draft.currentTerms === 'string'
      ? JSON.parse(draft.currentTerms)
      : draft.currentTerms;


    if (action === 'accept') {
      // 3. Create final lease
      const lease = await prismaClient.lease.create({
        data: {
          draftId: draft.id,
          finalTerms: terms,
          signedByClient: auth.role === 'client',
          signedByAgent: auth.role === 'assistant',
          activeFrom: new Date(terms.dates.start)
        }
      });

      // 4. Update all related statuses
      await prismaClient.leaseDraft.update({
        where: { id: draft.id },
        data: { status: 'signed' }
      });
      await prismaClient.property.update({
        where: { id: draft.propertyId },
        data: { status: 'rented' }
      });
      await prismaClient.negotiation.updateMany({
        where: { draftId: draft.id },
        data: { status: 'accepted' }
      });

      return NextResponse.json({
        lease_id: lease.id,
        start_date: terms.dates.start
      });

    } else { // Rejection
      await prismaClient.leaseDraft.update({
        where: { id: draft.id },
        data: { status: 'client_review' }
      });
      return NextResponse.json({ 
        message: 'Lease terms rejected' 
      });
    }

  } catch (error) {
    console.error('Finalization error:', error);
    return NextResponse.json(
      { message: 'Failed to finalize lease' },
      { status: 500 }
    );
  }
}