 import { NextRequest , NextResponse } from "next/server";
import { query } from "@/database/db";
import { authenticateToken } from "@/src/middleware";
import { Property } from "@/src/types";


export async function GET(req : NextRequest){

    try{
        const authResult = authenticateToken(req);

        if(authResult instanceof NextResponse){
            return authResult;
        }

        const properties = await query(
            'SELECT * FROM properties'
        ) as Property[]

        return NextResponse.json(
            {AllProperties : properties},
            {status : 200}
        )

    }catch(e){
        return NextResponse.json(
            {message : "Internal server Error"},
            {status : 500}
        )
    }
}