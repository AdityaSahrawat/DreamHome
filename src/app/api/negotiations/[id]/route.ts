import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/database';
import { authenticateToken } from '@/src/middleware';
import { LeaseTerms } from '@/src/types';

function validateLeaseTerms(terms: unknown): terms is LeaseTerms {
  if (typeof terms !== 'object' || terms === null) return false;
  const termsObj = terms as Record<string, unknown>;
  
  return (
    typeof termsObj?.financial === 'object' &&
    termsObj.financial !== null &&
    typeof (termsObj.financial as Record<string, unknown>)?.rent === 'number' &&
    typeof (termsObj.financial as Record<string, unknown>)?.deposit === 'number' &&
    typeof termsObj?.dates === 'object' &&
    termsObj.dates !== null &&
    typeof (termsObj.dates as Record<string, unknown>)?.start === 'string' &&
    typeof (termsObj.dates as Record<string, unknown>)?.end === 'string'
  );
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await authenticateToken(req);
  if (auth instanceof NextResponse) return auth;

  // Only staff can respond
  if (auth.role === 'client') {
    return NextResponse.json(
      { message: 'Only staff can respond to negotiations' },
      { status: 403 }
    );
  }

  const { action, counter_terms, response_message } = await req.json();

  if (action === 'counter' && !validateLeaseTerms(counter_terms)) {
    return NextResponse.json(
      { message: 'Invalid counter terms structure' },
      { status: 400 }
    );
  }

  const nego = await prismaClient.negotiation.findFirst({
    where: {
      id: Number(params.id),
      status: 'pending'
    }
  });

  if (!nego) {
    return NextResponse.json(
      { message: 'Negotiation not found or already processed' },
      { status: 404 }
    );
  }

  // 2. Process staff response
  if (action === 'accept') {
    await prismaClient.leaseDraft.update({
      where: { id: nego.draftId },
      data: {
        currentTerms: nego.proposedTerms as object,
        status: 'approved'
      }
    });

  } else if (action === 'counter') {
    // Create new counter offer
    await prismaClient.negotiation.create({
      data: {
        draftId: nego.draftId,
        proposedTerms: counter_terms,
        clientId: nego.clientId,
        staffId: auth.id,
        status: 'pending',
        previousNegotiationId: nego.id,
        message: response_message || 'Staff counter offer'
      }
    });
  }

  await prismaClient.negotiation.update({
    where: { id: Number(params.id) },
    data: {
      status: action === 'accept' ? 'accepted' : 'countered',
      staffId: auth.id,
      staffResponse: action === 'counter' ? counter_terms : null,
      responseMessage: response_message,
      respondedAt: new Date()
    }
  });

  return NextResponse.json({ success: true });
}