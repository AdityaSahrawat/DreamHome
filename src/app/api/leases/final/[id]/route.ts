import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/database/db';
import { authenticateToken } from '@/src/middleware';
import { ResultSetHeader } from 'mysql2';
import { Lease_draft, LeaseTerms } from '@/src/types';



export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await authenticateToken(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { action } = await req.json(); // 'accept' or 'reject'
    const draft_id = params.id;

    // 1. Verify draft is in approved state
    const [draft] = await query(`
      SELECT * FROM lease_draft 
      WHERE id = ? AND status = 'approved'
    `, [draft_id]) as Lease_draft[];

    if (!draft) {
      return NextResponse.json(
        { message: 'Draft not found or not approved' },
        { status: 404 }
      );
    }

    // 2. Type-safe terms parsing
    // Quick fix for your existing code
const terms = JSON.parse(JSON.stringify(draft.current_terms)) as LeaseTerms;

    if (action === 'accept') {
      // 3. Create final lease
      const [leaseResult] = await query(`
        INSERT INTO leases (
          draft_id,
          final_terms,
          signed_by_client,
          signed_by_agent,
          active_from
        ) VALUES (?, ?, ?, ?, ?)
      `, [
        draft_id,
        draft.current_terms,
        auth.role === 'client',
        auth.role === 'assistant',
        new Date(terms.dates.start)
      ]) as ResultSetHeader[];

      // 4. Update all related statuses
      await query('START TRANSACTION');
      
      await query(`
        UPDATE lease_draft 
        SET status = 'signed' 
        WHERE id = ?
      `, [draft_id]);

      await query(`
        UPDATE properties 
        SET status = 'rented' 
        WHERE id = ?
      `, [draft.property_id]);

      await query(`
        UPDATE negotiations
        SET status = 'completed'
        WHERE draft_id = ?
      `, [draft_id]);

      await query('COMMIT');

      return NextResponse.json({
        lease_id: leaseResult.insertId,
        start_date: terms.dates.start
      });

    } else { // Rejection
      await query(`
        UPDATE lease_draft
        SET status = 'client_review'
        WHERE id = ?
      `, [draft_id]);

      return NextResponse.json({ 
        message: 'Lease terms rejected' 
      });
    }

  } catch (error) {
    await query('ROLLBACK');
    console.error('Finalization error:', error);
    return NextResponse.json(
      { message: 'Failed to finalize lease' },
      { status: 500 }
    );
  }
}