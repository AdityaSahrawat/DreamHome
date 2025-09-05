import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/src/middleware';

export async function GET(req: NextRequest) {
    try {

        const authResult = await authenticateToken(req);
        if (authResult instanceof NextResponse) {
            return authResult;
        }
        console.log(authResult)
        return NextResponse.json(
            {authResult} ,
            {status : 200}
        )
    } catch (error) {
        console.error('Error in verify API:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}