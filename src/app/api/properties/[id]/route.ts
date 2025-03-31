import { NextRequest , NextResponse } from "next/server";
import { query } from "@/database/db";
import { authenticateToken } from "@/src/middleware";
import { Property, Property_image } from "@/src/types";


export async function DELETE(req : NextRequest , {params} : {params: {id: string}} ){
    try{
        const authResult = authenticateToken(req);

        if(authResult instanceof NextResponse){
            return authResult
        }

        const propertyId = params.id

        await query(
            'DELETE FROM properties where id = ?' ,
            [propertyId]
        )

        await query(
            'DELETE FROM property_photos where property_id = ?' ,
            [propertyId]
        )

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

        const property_id = params.id
        console.log("id :" , property_id)
        const properties = await query(
            'SELECT * FROM properties WHERE id = ? ' ,
            [property_id]
        ) as Property[]
        
        const property = properties[0]
        console.log("prop : " , property)
        const photos = await query(
            'SELECT * FROM property_photos where property_id = ?',
            [property_id]
        ) as Property_image[]
        console.log("prop : " , photos)
        return NextResponse.json({
            property , photos
        },{
            status : 200
        })

    }catch(e){
        console.error('Error in GET /api/property/[propertyId]:', e);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}