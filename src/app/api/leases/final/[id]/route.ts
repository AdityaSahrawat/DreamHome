import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/database';
import { authenticateToken } from '@/src/middleware';

type AuthUser = { id: number; role: string; branch_id?: number | null; email?: string };
const err = (status: number, message: string) => NextResponse.json({ message }, { status });



export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const authResult = await authenticateToken(req);
  if (authResult instanceof NextResponse) return authResult;
  const auth = authResult as AuthUser | null;
  if (!auth) return err(401, 'Authentication required');
  const user = auth as AuthUser; // non-null assertion for TS flow

  try {
  let body: { action?: string };
  try { body = await req.json(); } catch { return err(400, 'Invalid JSON body'); }
  const { action } = body;
  if (!action) return err(400, 'action required');
  const draftId = Number(params.id);
  if (Number.isNaN(draftId)) return err(400, 'Invalid draft id');


    const draft = await prismaClient.leaseDraft.findFirst({
      where: { id: draftId },
      include: { property: true, lease: true }
    });


    if (!draft) return err(404, 'Draft not found');
    if (draft.status !== 'approved') return err(409, 'Draft not in approved state');

    if (draft.lease) return err(409, 'Lease already finalized for this draft');


    // 2. Type-safe terms parsing
    const termsRaw = typeof draft.currentTerms === 'string'
      ? JSON.parse(draft.currentTerms)
      : draft.currentTerms;
    const terms = termsRaw as { dates?: { start?: string } };
    if (!terms?.dates?.start) return err(400, 'Invalid terms missing start date');


    if (action === 'accept') {
      // 3. Create final lease
      const lease = await prismaClient.lease.create({
        data: {
          draftId: draft.id,
          finalTerms: termsRaw as object,
          signedByClient: user.role === 'client',
          signedByAgent: user.role === 'assistant' || user.role === 'manager',
          activeFrom: new Date(terms.dates.start as string)
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
        leaseId: lease.id,
        startDate: terms.dates.start,
        draftStatus: 'signed'
      });

    } else if (action === 'reject') {
      // rollback to manager review path so assistant can adjust if needed
      await prismaClient.leaseDraft.update({
        where: { id: draft.id },
        data: { status: 'manager_review' }
      });
      return NextResponse.json({ message: 'Lease terms rejected' });
    } else {
      return err(400, 'Invalid action');
    }

  } catch (e) {
    console.error('Finalization error:', e);
    return err(500, 'Failed to finalize lease');
  }
}