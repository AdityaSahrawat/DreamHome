import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/src/middleware';
import { prismaClient } from '@/database';

type AuthUser = { id: number; role: string; branch_id: number | null; email?: string };
const err = (status: number, message: string) => NextResponse.json({ message }, { status });

export async function POST(req: NextRequest) {
    try {
        const authResult = await authenticateToken(req);
        if (authResult instanceof NextResponse) return authResult;
        const auth = authResult as AuthUser | null;
        if (!auth) return err(401, 'Authentication required');
        const { id, role, branch_id } = auth;

        if (role !== 'client') {
            return NextResponse.json(
                { message: 'Insufficient permissions' },
                { status: 403 }
            );
        }

    interface ApplyBody { title?: string; description?: string; price?: number | string; address?: string; city?: string; bedrooms?: number | string; bathrooms?: number | string; sqft?: number | string; type?: string; latitude?: number | string | null; longitude?: number | string | null; year_built?: number | string; }
    let body: ApplyBody;
    try { body = await req.json(); } catch { return err(400, 'Invalid JSON body'); }
    const { title, description, price, address , city , bedrooms , bathrooms , sqft , type , latitude , longitude , year_built } = body;

        if ([title, description, address, city, type].some(v => !v)) return err(400, 'Missing required string fields');
        if ([price, bedrooms, bathrooms, sqft, year_built].some(v => v === undefined || v === null)) return err(400, 'Missing required numeric fields');

        const numericPrice = Number(price);
        const numericBedrooms = Number(bedrooms);
        const numericBathrooms = Number(bathrooms);
        const numericSqft = Number(sqft);
        const numericYear = Number(year_built);
        if ([numericPrice, numericBedrooms, numericBathrooms, numericSqft, numericYear].some(n => Number.isNaN(n))) return err(400, 'Numeric fields must be valid numbers');
        if (numericPrice <= 0) return err(400, 'Price must be positive');
        if (numericBedrooms < 0 || numericBathrooms < 0) return err(400, 'Bedrooms/Bathrooms cannot be negative');
        if (numericSqft <= 0) return err(400, 'Square footage must be positive');
        if (numericYear < 1800 || numericYear > new Date().getFullYear() + 1) return err(400, 'Invalid year built');

        // Validate latitude and longitude ranges
        const latNum = latitude === undefined || latitude === null || latitude === '' ? null : Number(latitude);
        const lonNum = longitude === undefined || longitude === null || longitude === '' ? null : Number(longitude);
        if (latNum !== null && (Number.isNaN(latNum) || latNum < -90 || latNum > 90)) return err(400, 'Latitude must be between -90 and 90');
        if (lonNum !== null && (Number.isNaN(lonNum) || lonNum < -180 || lonNum > 180)) return err(400, 'Longitude must be between -180 and 180');

        const property = await prismaClient.property.create({
            data: {
                title: title as string,
                description,
                sqft: numericSqft,
                latitude: latNum,
                longitude: lonNum,
                bathrooms: numericBathrooms,
                bedrooms: numericBedrooms,
                city: city as string,
                price: numericPrice,
                address: address as string,
                yearBuilt: numericYear,
                status: 'pending',
                branchId: branch_id ?? null,
                agentId: id
            }
        });

        return NextResponse.json(
            { message: 'Property application submitted successfully', propertyId: property.id },
            { status: 201 }
        );
    } catch (e) {
        console.error('Error in POST /api/properties/apply:', e);
        return err(500, 'Internal server error');
    }
}