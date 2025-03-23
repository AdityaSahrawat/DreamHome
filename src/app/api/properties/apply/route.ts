import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/database/db';
import { authenticateToken } from '@/src/middleware';

export async function POST(req: NextRequest) {
    try {
        const authResult = await authenticateToken(req);

        if (authResult instanceof NextResponse) {
            return authResult;
        }

        const { id, role, branch_id } = authResult;

        if (role !== 'client') {
            return NextResponse.json(
                { message: 'Insufficient permissions' },
                { status: 403 }
            );
        }

        const { title, description, price, location } = await req.json();

        if (!title || !price || !location || !description) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        await query(
            'INSERT INTO properties (client_id, title, description, price, location, status , branch_id) VALUES (?, ?, ?, ?, ?, ? , ?)',
            [id, title, description, price, location, "pending" ,  branch_id]
        );

        return NextResponse.json(
            { message: 'Property application submitted successfully' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error in POST /api/property/apply:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}