// app/api/leases/schedule/route.ts
import { query } from '@/database/db';
import { authenticateToken } from '@/src/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { Property , ViewRequest } from '@/src/types';



export async function POST(req: NextRequest) {
  try {
    const authResult = await authenticateToken(req);
    
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    
    const { id: client_id } = authResult;

    const requestData = await req.json();
    const { property_id, message, scheduled_time } = requestData;
    console.log(property_id , message , scheduled_time)

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

    const mysqlDatetime = new Date(scheduled_time)
      .toISOString()
      .replace('T', ' ')
      .replace('Z', '')
      .split('.')[0];

    const properties = await query(
      'SELECT agent_id FROM properties WHERE id = ?',
      [property_id]
    ) as Property[]

    if (!properties || properties.length === 0) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }
    const assistant_id = properties[0].agent_id;


    const result = await query(
      `INSERT INTO viewRequests 
       (client_id, property_id, assistant_id, status, scheduled_time, message) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [client_id, property_id, assistant_id, 'pending', mysqlDatetime, message]
    );

    const viewingRequest = {
      client_id,
      property_id,
      assistant_id,
      status: 'pending',
      scheduled_time,
      message
    };

    return NextResponse.json(
      { 
        success: true, 
        data: viewingRequest,
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



export async function PUT(req: NextRequest) {
    const authResult = await authenticateToken(req);
    if (authResult instanceof NextResponse) return authResult;
    
    const { role } = authResult;
    if (role !== 'manager') {
        return NextResponse.json(
            { message: 'Unauthorized - Manager access required' },
            { status: 403 }
        );
    }

    try {
        const { requestId, status } = await req.json();

        console.log(requestId , status)
        
        if (!requestId || !status) {
            return NextResponse.json(
                { message: 'Request ID and status are required' },
                { status: 400 }
            );
        }
        await query(
            'UPDATE viewrequests SET status = ? WHERE request_id = ?',
            [status, requestId]
        );

        
        if (status === 'approved') {
            // You might want to add additional logic here, like:
            // - Create a calendar event
            // - Notify the client
            // - Assign staff to the viewing
        }

        return NextResponse.json(
            { message: 'Viewing request updated successfully' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error updating viewing request:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}