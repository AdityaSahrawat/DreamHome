import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/src/middleware';
import { prismaClient } from '@/database';

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

        // Validate latitude and longitude ranges
        if (latitude !== null && latitude !== undefined && (latitude < -90 || latitude > 90)) {
            return NextResponse.json(
                { message: 'Latitude must be between -90 and 90 degrees' },
                { status: 400 }
            );
        }

        if (longitude !== null && longitude !== undefined && (longitude < -180 || longitude > 180)) {
            return NextResponse.json(
                { message: 'Longitude must be between -180 and 180 degrees' },
                { status: 400 }
            );
        }

        const property = await prismaClient.property.create({
            data: {
                title,
                description,
                sqft,
                latitude: latitude && latitude !== 0 ? latitude : null,
                longitude: longitude && longitude !== 0 ? longitude : null,
                bathrooms,
                bedrooms,
                city,
                price,
                address,
                yearBuilt: year_built,
                status: 'pending',
                branchId: branch_id,
                agentId: id // Assuming client is agent for new property
            }
        });

        return NextResponse.json(
            { message: 'Property application submitted successfully', propertyId: property.id },
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