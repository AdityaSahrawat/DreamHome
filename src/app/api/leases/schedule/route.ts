// app/api/leases/schedule/route.ts
import { prismaClient } from '@/database';
import { authenticateToken } from '@/src/middleware';
import { NextRequest, NextResponse } from 'next/server';



interface SchedulePayload {
  property_id: number;
  message: string;
  scheduled_time: string; // ISO string
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const authResult = await authenticateToken(req);
    
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id: client_id } = authResult;

    let requestData: SchedulePayload;
    try {
      requestData = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
    const { property_id, message, scheduled_time } = requestData;
  // Removed debug log: schedule creation data

    const errors: string[] = [];
    
    if (!property_id || typeof property_id !== 'number' || property_id < 1) {
      errors.push('Invalid property ID');
    }
    
    if (!message || typeof message !== 'string' || message.length < 10) {
      errors.push('Message must be at least 10 characters');
    }
    
    if (!scheduled_time || typeof scheduled_time !== 'string' || isNaN(Date.parse(scheduled_time))) {
      errors.push('Invalid date format');
    }
    
    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    const property = await prismaClient.property.findUnique({ where: { id: property_id } });
    if (!property || !property.agentId) {
      return NextResponse.json(
        { error: 'Property not found or missing agent' },
        { status: 404 }
      );
    }
    const viewRequest = await prismaClient.viewRequest.create({ data: {
      clientId: client_id,
      propertyId: property_id,
      assistantId: property.agentId,
      status: 'pending',
      scheduledTime: new Date(scheduled_time),
      message
    }});
    return NextResponse.json(
      { 
        success: true, 
        data: viewRequest,
        message: 'Viewing request submitted successfully' 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error scheduling viewing:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}



type ViewRequestStatus = 'approved' | 'rejected' | 'pending';

export async function PUT(req: NextRequest): Promise<NextResponse> {
  const authResult = await authenticateToken(req);
  if (authResult instanceof NextResponse) return authResult;
  if (!authResult) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { role } = authResult;
  if (role !== 'manager') {
    return NextResponse.json({ message: 'Unauthorized - Manager access required' }, { status: 403 });
  }

  try {
    let body: { requestId?: number | string; status?: string };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
    }
    const { requestId, status } = body;

  // Removed debug log: requestId, status
        
    if (!requestId || !status) {
      return NextResponse.json({ message: 'Request ID and status are required' }, { status: 400 });
    }
    const normalizedStatus = status as ViewRequestStatus;
    if (!['approved','rejected','pending'].includes(normalizedStatus)) {
      return NextResponse.json({ message: 'Invalid status value' }, { status: 400 });
    }
    const numericId = Number(requestId);
    if (!Number.isInteger(numericId) || numericId < 1) {
      return NextResponse.json({ message: 'Invalid requestId' }, { status: 400 });
    }

    await prismaClient.viewRequest.update({ where: { id: numericId }, data: { status: normalizedStatus } });

        
    if (normalizedStatus === 'approved') {
      // Future hook: calendar event / notification dispatch
    }

  return NextResponse.json({ message: 'Viewing request updated successfully' }, { status: 200 });
  } catch (error) {
  console.error('Error updating viewing request:', error);
  return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}