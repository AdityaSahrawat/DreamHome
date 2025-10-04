import { NextRequest, NextResponse } from 'next/server';
// import { query } from '@/database/db';
import { prismaClient } from '@/database';
import { authenticateToken } from '@/src/middleware';
import { LeaseTerms } from '@/src/types';

export async function POST(req: NextRequest) {
  try {
    const { property_id, client_id, terms } = await req.json();

    if (!property_id || !client_id || !terms) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check property availability
    const property = await prismaClient.property.findUnique({
      where: { id: Number(property_id) }
    });

    if (!property) {
      return NextResponse.json(
        { message: 'Property not found' },
        { status: 404 }
      );
    }

    if (property.status !== 'approved') {
      return NextResponse.json(
        { message: 'Property not available for leasing' },
        { status: 400 }
      );
    }

    // Validate terms structure
    if (!terms.dates?.start || !terms.dates?.end || !terms.financial?.rent) {
      return NextResponse.json(
        { message: 'Invalid lease terms structure' },
        { status: 400 }
      );
    }

    const draft = await prismaClient.leaseDraft.create({
      data: {
        propertyId: property.id,
        clientId: client_id,
        currentTerms: terms,
        status: 'draft',
        version: 1
      }
    });

    // Optionally update property status to "in_negotiation"
    // await prismaClient.property.update({
    //   where: { id: property.id },
    //   data: { status: 'in_negotiation' }
    // });

    return NextResponse.json(
      { 
        id: draft.id, 
        message: 'Draft created successfully',
        status: 'draft'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Draft creation error:', error);
    return NextResponse.json(
      { message: 'Failed to create lease draft' },
      { status: 500 }
    );
  }
}

// Update existing lease draft: allow updating terms (on client acceptance of counter) or transitioning status forward.
export async function PATCH(req: NextRequest) {
  const auth = await authenticateToken(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { draftId, terms, action } = await req.json();
    if (!draftId) return NextResponse.json({ message: 'draftId required' }, { status: 400 });

    const draft = await prismaClient.leaseDraft.findUnique({
      where: { id: Number(draftId) },
      include: { lease: true, property: true }
    });
    if (!draft) return NextResponse.json({ message: 'Draft not found' }, { status: 404 });

    // Terminal states guard
    if (['canceled', 'signed'].includes(draft.status)) {
      return NextResponse.json({ message: 'Draft is in a terminal state' }, { status: 409 });
    }

    // Role-based allowed actions
    const role = auth.role;
    const clientActions = ['client_accept', 'client_reject'];
    const assistantActions = ['assistant_update', 'assistant_cancel'];
    const managerActions = ['manager_approve'];

    const allowed = (
      (role === 'client' && clientActions.includes(action)) ||
      (role === 'assistant' && assistantActions.includes(action)) ||
      (role === 'manager' && managerActions.includes(action))
    );
    if (!allowed) return NextResponse.json({ message: 'Unauthorized action' }, { status: 403 });

    // State transition validation
    const currentStatus = draft.status as string;
    const invalidTransition = () => NextResponse.json({ message: 'Invalid state transition' }, { status: 409 });

    let nextStatus: string | undefined;
    let updateTerms = false;
    let autoLeaseCreated = false;
    let leaseId: number | undefined;

    switch (action) {
      case 'client_accept':
        if (currentStatus !== 'draft') return invalidTransition();
        nextStatus = 'client_accepted';
        break;
      case 'client_reject':
        if (currentStatus !== 'draft') return invalidTransition();
        nextStatus = 'client_rejected';
        break;
      case 'assistant_update':
        if (!['draft', 'client_rejected'].includes(currentStatus)) return invalidTransition();
        if (!terms) return NextResponse.json({ message: 'terms required for assistant_update' }, { status: 400 });
        const t = terms as LeaseTerms;
        if (!t?.dates?.start || !t?.dates?.end || typeof t?.financial?.rent !== 'number') {
          return NextResponse.json({ message: 'Invalid terms structure' }, { status: 400 });
        }
        updateTerms = true;
        nextStatus = 'draft'; // remain/return to draft for client review
        break;
      case 'assistant_cancel':
        if (!['draft', 'client_rejected'].includes(currentStatus)) return invalidTransition();
        nextStatus = 'canceled';
        break;
      case 'manager_approve':
        if (currentStatus !== 'client_accepted') return invalidTransition();
        nextStatus = 'approved';
        break;
      default:
        return NextResponse.json({ message: 'Unknown action' }, { status: 400 });
    }

    const data: Record<string, unknown> = { status: nextStatus };
    if (updateTerms) {
      data.currentTerms = terms as object; // Prisma JSON
    }

    const updatedDraft = await prismaClient.leaseDraft.update({
      where: { id: Number(draftId) },
      data
    });

    // Auto-create lease when moving to approved and none exists yet
    if (action === 'manager_approve') {
      if (!draft.lease) {
        const parsedTermsRaw = typeof updatedDraft.currentTerms === 'string'
          ? JSON.parse(updatedDraft.currentTerms as unknown as string)
          : updatedDraft.currentTerms;
        // Narrow minimal shape for dates
        const parsedTerms: { dates?: { start?: string } } = parsedTermsRaw as { dates?: { start?: string } };
        try {
          const lease = await prismaClient.lease.create({
            data: {
              draftId: updatedDraft.id,
              finalTerms: parsedTerms as object,
              signedByClient: false,
              signedByAgent: false,
              activeFrom: new Date(parsedTerms?.dates?.start ?? Date.now())
            }
          });
          leaseId = lease.id;
          autoLeaseCreated = true;
          // Optionally mark draft signed immediately if business wants immediate finalization
          await prismaClient.leaseDraft.update({
            where: { id: updatedDraft.id },
            data: { status: 'signed' }
          });
        } catch (e) {
          console.error('Auto lease creation failed:', e);
        }
      }
    }

    return NextResponse.json({
      id: updatedDraft.id,
      status: autoLeaseCreated ? 'signed' : updatedDraft.status,
      autoLeaseCreated,
      leaseId,
      message: 'Draft updated'
    });
  } catch (error) {
    console.error('Lease draft update error:', error);
    return NextResponse.json({ message: 'Failed to update draft' }, { status: 500 });
  }
}