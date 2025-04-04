import { NextApiRequest, NextApiResponse } from 'next';
import { query } from "@/database/db"
import { NextResponse } from 'next/server';

export async function GET(req: Request, res: NextApiResponse) {
    try {

        const result = await query(
            'Select * from branch'
        )

        return NextResponse.json({
            result
        },{
            status : 200
        })
        
    } catch (error) {
        console.error("Error in register API:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
