import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/database/db';
import { authenticateToken } from '@/src/middleware';
import { LeaseTerms } from '@/src/types';

function validateLeaseTerms(terms: any): terms is LeaseTerms {
  return (
    typeof terms?.financial?.rent === 'number' &&
    typeof terms?.financial?.deposit === 'number' &&
    typeof terms?.dates?.start === 'string' &&
    typeof terms?.dates?.end === 'string'
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

  const [nego] = await query(`
    SELECT * FROM negotiations 
    WHERE id = ? AND status = 'pending'
    FOR UPDATE
  `, [params.id]) as any[];

  if (!nego) {
    return NextResponse.json(
      { message: 'Negotiation not found or already processed' },
      { status: 404 }
    );
  }

  // 2. Process staff response
  if (action === 'accept') {
    await query(`
      UPDATE lease_draft
      SET 
        current_terms = ?,
        status = 'approved'
      WHERE id = ?
    `, [nego.proposed_terms, nego.draft_id]);

  } else if (action === 'counter') {
    // Create new counter offer
    await query(`
      INSERT INTO negotiations (
        draft_id,
        proposed_terms,
        client_id,
        status,
        previous_negotiation_id,
        message
      ) VALUES (?, ?, ?, 'pending', ?, ?)
    `, [
      nego.draft_id,
      JSON.stringify(counter_terms),
      nego.client_id,
      nego.id,
      response_message || 'Staff counter offer'
    ]);
  }

  await query(`
    UPDATE negotiations
    SET 
      status = ?,
      staff_id = ?,
      staff_response = ?,
      response_message = ?,
      responded_at = NOW()
    WHERE id = ?
  `, [
    action === 'accept' ? 'accepted' : 'countered',
    auth.id,
    action === 'counter' ? JSON.stringify(counter_terms) : null,
    response_message,
    params.id
  ]);

  return NextResponse.json({ success: true });
}