import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/database';
import { authenticateToken } from '@/src/middleware';
import { LeaseTerms } from '@/src/types';

type AuthUser = { id: number; role: string; branch_id?: number | null; email?: string };

// Unified error helper
const error = (status: number, message: string) => NextResponse.json({ message }, { status });

// Allowed state transitions (enum in schema: draft, client_review, manager_review, approved, signed)
type DraftAction = 'client_accept' | 'client_reject' | 'assistant_update' | 'assistant_cancel' | 'manager_approve';

interface CreateDraftPayload {
  property_id?: number; // snake_case backwards compat
  propertyId?: number;
  client_id?: number;
  clientId?: number;
  terms?: Partial<LeaseTerms>;
}

export async function POST(req: NextRequest) {
  try {
  const authResult = await authenticateToken(req);
  if (authResult instanceof NextResponse) return authResult;
  const auth = authResult as AuthUser | null;
  if (!auth) return error(401, 'Authentication required');
  if (!['assistant', 'manager'].includes(auth.role)) return error(403, 'Only assistant or manager can create drafts');

    let body: CreateDraftPayload;
    try { body = await req.json(); } catch { return error(400, 'Invalid JSON body'); }
    const propertyId = body.propertyId ?? body.property_id;
    const clientId = body.clientId ?? body.client_id;
    const terms = body.terms;

    if (!propertyId || !clientId || !terms) return error(400, 'Missing required fields');

    // Check property availability
    const property = await prismaClient.property.findUnique({
      where: { id: Number(propertyId) }
    });

    if (!property) return error(404, 'Property not found');
    if (property.status !== 'approved') return error(400, 'Property not available for leasing');

    // Ensure no existing draft already for this property (propertyId unique in schema)
    const existing = await prismaClient.leaseDraft.findUnique({ where: { propertyId: property.id } });
    if (existing) return error(409, 'Draft already exists for this property');

    // Validate terms structure
    if (!terms.dates?.start || !terms.dates?.end || typeof terms.financial?.rent !== 'number') {
      return error(400, 'Invalid lease terms structure');
    }

    // Basic date sanity
    if (new Date(terms.dates.start).getTime() >= new Date(terms.dates.end).getTime()) {
      return error(400, 'Start date must be before end date');
    }

    const draft = await prismaClient.leaseDraft.create({
      data: {
        propertyId: property.id,
        clientId: clientId,
        currentTerms: terms as object,
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
  } catch (error: unknown) {
    console.error('Draft creation error:', error);
    return NextResponse.json(
      { message: 'Failed to create lease draft' },
      { status: 500 }
    );
  }
}

// Update existing lease draft: allow updating terms (on client acceptance of counter) or transitioning status forward.
export async function PATCH(req: NextRequest) {
  const authResult = await authenticateToken(req);
  if (authResult instanceof NextResponse) return authResult;
  const auth = authResult as AuthUser | null;
  if (!auth) return error(401, 'Authentication required');

  try {
    let body: { draftId?: number; terms?: Partial<LeaseTerms>; action?: DraftAction };
    try { body = await req.json(); } catch { return error(400, 'Invalid JSON body'); }
    const { draftId, terms, action } = body;
    if (!draftId) return error(400, 'draftId required');
    if (!action) return error(400, 'action required');

    const draft = await prismaClient.leaseDraft.findUnique({
      where: { id: Number(draftId) },
      include: { lease: true, property: true }
    });
    if (!draft) return error(404, 'Draft not found');

    // Terminal states guard
    if (['canceled', 'signed'].includes(draft.status)) {
      return error(409, 'Draft is in a terminal state');
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
  if (!allowed) return error(403, 'Unauthorized action');

    // State transition validation
    const currentStatus = draft.status as string;
  const invalidTransition = () => error(409, 'Invalid state transition');

    let nextStatus: string | undefined;
    let updateTerms = false;
    let autoLeaseCreated = false;
    let leaseId: number | undefined;

    switch (action) {
      case 'client_accept': // client moves draft to client_review
        if (currentStatus !== 'draft') return invalidTransition();
        nextStatus = 'client_review';
        break;
      case 'client_reject': // send back to assistant editable state
        if (currentStatus !== 'draft') return invalidTransition();
        nextStatus = 'draft'; // remain draft but flagged via negotiation path; we could store a flag
        break;
      case 'assistant_update':
        if (!['draft', 'client_review'].includes(currentStatus)) return invalidTransition();
        if (!terms) return error(400, 'terms required for assistant_update');
        if (!terms?.dates?.start || !terms?.dates?.end || typeof terms?.financial?.rent !== 'number') {
          return error(400, 'Invalid terms structure');
        }
        updateTerms = true;
        nextStatus = 'draft'; // reset to draft for new client review cycle
        break;
      case 'assistant_cancel':
        if (!['draft', 'client_review'].includes(currentStatus)) return invalidTransition();
        nextStatus = 'canceled';
        break;
      case 'manager_approve':
        if (currentStatus !== 'client_review') return invalidTransition();
        nextStatus = 'approved';
        break;
      default:
        return error(400, 'Unknown action');
    }

    const data: Record<string, unknown> = { status: nextStatus };
    if (updateTerms) data.currentTerms = terms as object; // Prisma JSON

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
          // Keep status 'approved'; do not auto set to 'signed' until signatures collected
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
  } catch (errUpdate: unknown) {
    console.error('Lease draft update error:', errUpdate);
    return error(500, 'Failed to update draft');
  }
}