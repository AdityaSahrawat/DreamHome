// app/api/negotiations/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/database/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { authenticateToken } from '@/src/middleware';
import { LeaseTerms } from '@/src/types';



// Enhanced validation
export function isLeaseTerms(data: unknown): data is LeaseTerms {
  if (typeof data !== 'object' || data === null) return false;

  const terms = data as Record<string, unknown>;
  
  // Validate financial
  if (typeof terms.financial !== 'object' || terms.financial === null) return false;
  if (typeof (terms.financial as any).rent !== 'number') return false;
  if (typeof (terms.financial as any).deposit !== 'number') return false;

  // Validate dates
  if (typeof terms.dates !== 'object' || terms.dates === null) return false;
  if (typeof (terms.dates as any).start !== 'string') return false;
  if (typeof (terms.dates as any).end !== 'string') return false;

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
    const [draft] = await query(
      `SELECT status FROM lease_draft WHERE id = ?`,
      [draft_id]
    ) as any[];

    if (!draft || !['draft', 'client_review'].includes(draft.status)) {
      return NextResponse.json(
        { message: 'Draft not found or not in negotiable state' },
        { status: 400 }
      );
    }

    // 5. Create negotiation record
    const result = await query(
      `INSERT INTO negotiations (
        draft_id,
        proposed_terms,
        client_id,
        message,
        status
      ) VALUES (?, ?, ?, ? , 'pending')`,
      [
        draft_id,
        JSON.stringify(proposed_terms),
        auth.id,  // Track which client created this
        message || null,
      ]
    ) as ResultSetHeader;

    // 6. Update draft status
    await query(
      `UPDATE lease_draft SET status = 'client_review' WHERE id = ?`,
      [draft_id]
    );

    return NextResponse.json(
      {
        negotiation_id: result.insertId,
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

interface NegotiationRow extends RowDataPacket {
  id: number;
  draft_id: number;
  proposed_terms: string;
  status: 'pending' | 'accepted' | 'rejected' | 'countered';
  message: string;
  created_at: Date;
  client_id: number;
  responded_at?: Date;
  staff_response?: string;
  response_message?: string;
  staff_id?: number;
  previous_negotiation_id?: number;
  client_name?: string;
  staff_name?: string;
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

    // Base query with joins
    let queryStr = `
      SELECT 
        n.id,
        n.draft_id,
        n.proposed_terms,
        n.status,
        n.message,
        n.created_at,
        n.client_id,
        n.responded_at,
        n.staff_response,
        n.response_message,
        n.staff_id,
        n.previous_negotiation_id,
        c.name as client_name,
        s.name as staff_name
      FROM negotiations n
      LEFT JOIN client c ON n.client_id = c.id
      LEFT JOIN staff s ON n.staff_id = s.id
      WHERE n.draft_id = ?
    `;

    const params: (string | number)[] = [draft_id];

    // Role-based filtering
    if (auth.role === 'client') {
      queryStr += ` AND n.client_id = ?`;
      params.push(auth.id);
    } else {
      queryStr += ` AND (n.client_id IS NOT NULL OR n.staff_id = ?)`;
      params.push(auth.id);
    }

    queryStr += ` ORDER BY n.created_at DESC`;

    // Execute query
    const result = await query(queryStr, params) as NegotiationRow[]

    // Process results
    const negotiations = (Array.isArray(result) ? result : []).map(nego => ({
      id: nego.id,
      draft_id: nego.draft_id,
      proposed_terms: safeJsonParse(nego.proposed_terms),
      status: nego.status,
      message: nego.message,
      created_at: nego.created_at,
      client_id: nego.client_id,
      responded_at: nego.responded_at,
      staff_response: safeJsonParse(nego.staff_response),
      response_message: nego.response_message,
      staff_id: nego.staff_id,
      previous_negotiation_id: nego.previous_negotiation_id,
      client_name: nego.client_name,
      staff_name: nego.staff_name
    }));

    return NextResponse.json(negotiations);

  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch negotiations' },
      { status: 500 }
    );
  }
}

// Helper function for safe JSON parsing
function safeJsonParse(json: any): any {
  try {
    return typeof json === 'string' ? JSON.parse(json) : json;
  } catch {
    return null;
  }
}