import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/database/db';
import { Property } from '@/src/types';
import { ResultSetHeader } from 'mysql2';

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
    const [property] = await query(
      `SELECT status FROM properties WHERE id = ?`,
      [property_id]
    ) as Property[];

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

    const result = await query(
      `INSERT INTO lease_draft 
       (property_id, client_id, current_terms, status, version)
       VALUES (?, ?, ?, 'draft', 1)`,
      [property_id, client_id, JSON.stringify(terms)]
    ) as ResultSetHeader;

    // Update property status to "in_negotiation"
    // await query(
    //   `UPDATE properties SET status = 'in_negotiation' WHERE id = ?`,
    //   [property_id]
    // );

    return NextResponse.json(
      { 
        id: result.insertId, 
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