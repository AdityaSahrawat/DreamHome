// app/api/leases/draft/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/database/db';
import { Lease_draft } from '@/src/types';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const draftId = params.id;
    
    const [draft] = await query(
      `SELECT 
        id,
        property_id,
        client_id,
        current_terms,
        status,
        version,
        created_at,
        updated_at
       FROM lease_draft 
       WHERE id = ?`,
      [draftId]
    ) as Lease_draft[];

    if (!draft) {
      return NextResponse.json(
        { message: 'Draft not found' },
        { status: 404 }
      );
    }

    // Parse terms if stored as string
    const terms = typeof draft.current_terms === 'string' 
      ? JSON.parse(draft.current_terms)
      : draft.current_terms;

    return NextResponse.json({
      ...draft,
      current_terms: terms
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch draft' },
      { status: 500 }
    );
  }
}