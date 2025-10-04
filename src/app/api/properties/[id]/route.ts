import { NextRequest , NextResponse } from "next/server";
import { authenticateToken } from "@/src/middleware";
import { prismaClient } from '@/database';
// Removed unused imports for query, Property, and Property_image


export async function DELETE(req : NextRequest , {params} : {params: Promise<{id: string}> }){
    try{
        // Since middleware currently allows all API routes, we'll require authentication here
        const authResult = await authenticateToken(req);

        if(authResult instanceof NextResponse){
            return authResult
        }

        const resolvedParams = await params;
        const propertyId = resolvedParams.id


        await prismaClient.property.delete({
            where: { id: Number(propertyId) }
        });

        await prismaClient.propertyPhoto.deleteMany({
            where: { propertyId: Number(propertyId) }
        });

        return NextResponse.json({
            message : "Property Deleted Successfully"
        })

    }catch(e){
        console.error('Error in DELETE /api/property/[propertyId]:', e);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET(req : NextRequest ,{params} : {params: Promise<{id: string}> }){
    console.log("Getting property details")
    try{
        // Since middleware currently allows all API routes, we'll make this endpoint public for now
        // const authResult = authenticateToken(req);
        // if(authResult instanceof NextResponse){
        //     return authResult;
        // }

        const resolvedParams = await params;
        const property_id = resolvedParams.id;
        const property = await prismaClient.property.findUnique({
            where: { id: Number(property_id) },
            include: { photos: true }
        });
        
        if (!property) {
            return NextResponse.json(
                { message: 'Property not found' },
                { status: 404 }
            );
        }

        // Transform the property data to match expected format
        const transformedProperty = {
            id: property.id,
            title: property.title,
            description: property.description,
            price: property.price,
            address: property.address,
            city: property.city,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            area: property.sqft,
            type: property.type || 'House', // Default type
            yearBuilt: property.yearBuilt,
            latitude: property.latitude,
            longitude: property.longitude,
            status: property.status,
            createdAt: property.createdAt,
            photos: property.photos.map(photo => photo.photoUrl)
        };
        
        return NextResponse.json({ property: transformedProperty });

    }catch(e){
        console.error('Error in GET /api/property/[propertyId]:', e);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}