// app/api/negotiations/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/database';
import { authenticateToken } from '@/src/middleware';
import { LeaseTerms } from '@/src/types';

// Enhanced validation
export function isLeaseTerms(data: unknown): data is LeaseTerms {
  if (typeof data !== 'object' || data === null) return false;

  const terms = data as Record<string, unknown>;
  
  // Validate financial
  if (typeof terms.financial !== 'object' || terms.financial === null) return false;
  const financial = terms.financial as Record<string, unknown>;
  if (typeof financial.rent !== 'number') return false;
  if (typeof financial.deposit !== 'number') return false;

  // Validate dates
  if (typeof terms.dates !== 'object' || terms.dates === null) return false;
  const dates = terms.dates as Record<string, unknown>;
  if (typeof dates.start !== 'string') return false;
  if (typeof dates.end !== 'string') return false;

  return true;
}

export async function POST(req: NextRequest) {
  // 1. Authentication
  const auth = await authenticateToken(req);
  if (auth instanceof NextResponse) return auth;

  // 2. Only clients can initiate negotiations
  if (auth.role !== 'client') {
    return NextResponse.json(
      { message: 'Only clients can initiate negotiations' },
      { status: 403 }
    );
  }

  try {
    // 3. Parse and validate input
    const { draft_id, proposed_terms, message } = await req.json();

    if (!isLeaseTerms(proposed_terms)) {
      return NextResponse.json(
        { message: 'Invalid lease terms structure' },
        { status: 400 }
      );
    }

    // 4. Verify draft exists and is in negotiable state
    const draft = await prismaClient.leaseDraft.findUnique({
      where: { id: draft_id },
      select: { status: true }
    });

    if (!draft || !['draft', 'client_review'].includes(draft.status)) {
      return NextResponse.json(
        { message: 'Draft not found or not in negotiable state' },
        { status: 400 }
      );
    }

    // 5. Create negotiation record
    const negotiation = await prismaClient.negotiation.create({
      data: {
        draftId: draft_id,
        proposedTerms: proposed_terms as object,
        clientId: auth.id,
        staffId: auth.id, // Required field - using auth.id as placeholder
        message: message || null,
        status: 'pending'
      }
    });

    // 6. Update draft status
    await prismaClient.leaseDraft.update({
      where: { id: draft_id },
      data: { status: 'client_review' }
    });

    return NextResponse.json(
      {
        negotiation_id: negotiation.id,
        draft_status: 'client_review',
        message: 'Negotiation started successfully'
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Negotiation error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const auth = await authenticateToken(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { searchParams } = new URL(req.url);
    const draft_id = searchParams.get('draft_id');

    if (!draft_id) {
      return NextResponse.json(
        { message: 'draft_id query parameter is required' },
        { status: 400 }
      );
    }

    // Build where clause based on role
    const whereClause: Record<string, unknown> = {
      draftId: parseInt(draft_id)
    };

    if (auth.role === 'client') {
      whereClause.clientId = auth.id;
    }

    // Execute query with Prisma
    const negotiations = await prismaClient.negotiation.findMany({
      where: whereClause,
      include: {
        client: {
          select: { name: true }
        },
        staff: {
          select: { name: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Process results
    const processedNegotiations = negotiations.map(nego => ({
      id: nego.id,
      draft_id: nego.draftId,
      proposed_terms: safeJsonParse(nego.proposedTerms),
      status: nego.status,
      message: nego.message,
      created_at: nego.createdAt,
      client_id: nego.clientId,
      responded_at: nego.respondedAt,
      staff_response: safeJsonParse(nego.staffResponse),
      response_message: nego.responseMessage,
      staff_id: nego.staffId,
      previous_negotiation_id: nego.previousNegotiationId,
      client_name: nego.client.name,
      staff_name: nego.staff.name
    }));

    return NextResponse.json(processedNegotiations);

  } catch (error) {
    console.error('Failed to fetch negotiations:', error);
    return NextResponse.json(
      { message: 'Failed to fetch negotiations' },
      { status: 500 }
    );
  }
}

// Helper function for safe JSON parsing
function safeJsonParse(json: unknown): unknown {
  try {
    return typeof json === 'string' ? JSON.parse(json) : json;
  } catch {
    return null;
  }
}