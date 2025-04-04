import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/database/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

// Helper function to check if result is an array
function isArrayResult(result: any): result is RowDataPacket[] {
  return Array.isArray(result);
}

export async function POST(req: NextRequest) {
  try {
    const { draft_id } = await req.json();

    const draftResult = await query(
      `SELECT d.*, p.agent_id 
       FROM lease_draft d
       JOIN properties p ON d.property_id = p.id
       WHERE d.id = ?`,
      [draft_id]
    );

    if (!isArrayResult(draftResult)) {
      return NextResponse.json(
        { message: 'Unexpected database response format' },
        { status: 500 }
      );
    }

    if (draftResult.length === 0) {
      return NextResponse.json(
        { message: 'Draft not found or not approved' },
        { status: 404 }
      );
    }

    const draft = draftResult[0];

    // 2. Create the final lease
    const leaseResult = await query(
      `INSERT INTO leases 
       (draft_id, final_terms, active_from, signed_by_client, signed_by_agent)
       VALUES (?, ?, ?, FALSE, FALSE)`,
      [
        draft_id,
        draft.current_terms,
        new Date(draft.current_terms.dates.start) // Extract start date from terms
      ]
    ) as ResultSetHeader;

    // 3. Update property status to 'rented'
    await query(
      `UPDATE properties SET status = 'rented' WHERE id = ?`,
      [draft.property_id]
    );

    // 4. Update draft status to 'signed'
    await query(
      `UPDATE lease_draft SET status = 'signed' WHERE id = ?`,
      [draft_id]
    );

    return NextResponse.json(
      { 
        lease_id: leaseResult.insertId,
        message: 'Lease finalized successfully'
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Finalize lease error:', error);
    return NextResponse.json(
      { 
        message: 'Failed to finalize lease',
        error: error.message 
      },
      { status: 500 }
    );
  }
}