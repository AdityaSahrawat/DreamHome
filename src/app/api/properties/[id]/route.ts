import { NextRequest , NextResponse } from "next/server";
import { authenticateToken } from "@/src/middleware";
import { prismaClient } from '@/database';
// Removed unused imports for query, Property, and Property_image


export async function DELETE(req : NextRequest , {params} : {params: {id: string}} ){
    try{
        const authResult = authenticateToken(req);

        if(authResult instanceof NextResponse){
            return authResult
        }

        const propertyId = params.id


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

export async function GET(req : NextRequest ,{params} : {params: {id: number} }){
    console.log("aldvnadivnaisnvsdn 0138471563y")
    try{
        const authResult = authenticateToken(req);

        if(authResult instanceof NextResponse){
            return authResult;
        }

        const property_id = params.id;
        const property = await prismaClient.property.findUnique({
            where: { id: Number(property_id) },
            include: { photos: true }
        });
        return NextResponse.json({ property });

    }catch(e){
        console.error('Error in GET /api/property/[propertyId]:', e);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}