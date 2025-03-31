import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/database/db';
import { authenticateToken } from '@/src/middleware';
import { Property } from '@/src/types';
import { ResultSetHeader } from 'mysql2';

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

        const { title, description, price, address , city , bedrooms , bathrooms , sqft , type , latitude , longitude , year_built } = await req.json();

        if (!title || !price || !description || !address || !city || !bedrooms || !bathrooms || !sqft || !type || !year_built ) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        const results = await query(
            'INSERT INTO properties (client_id, title, description, sqft , type , latitude ,longitude , bathrooms , bedrooms,city ,price, address,year_built , status, branch_id) VALUES (?, ?, ?, ?,?, ?, ?, ?,?,?,?,?,?,?,?)',
            [id, title, description,sqft,type,latitude,longitude,bathrooms,bedrooms,city, price, address,year_built, "pending", branch_id]
        ) as ResultSetHeader;
        let propertyId: number;
        
        if (Array.isArray(results)) {
            propertyId = results[0].insertId;
        } else {
            propertyId = results.insertId;
        }

        return NextResponse.json(
            { message: 'Property application submitted successfully', propertyId },
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