import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        // This is now a public endpoint that returns auth status
        // The middleware will handle authentication for protected routes
        
        // Check if user has a token (without validating it here)
        const token = req.cookies.get('token')?.value || 
                      req.headers.get('Authorization')?.replace('Bearer ', '') || '';
        
        return NextResponse.json({
            authenticated: !!token,
            hasToken: !!token,
            timestamp: new Date().toISOString(),
            endpoint: '/api/auth'
        }, { status: 200 });
        
    } catch (error) {
        console.error('Error in auth API:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}