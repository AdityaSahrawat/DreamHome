import { NextRequest, NextResponse } from 'next/server';
// import { query } from '@/database/db';
import { prismaClient } from '@/database';

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