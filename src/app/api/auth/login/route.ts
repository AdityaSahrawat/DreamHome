import { NextResponse } from 'next/server';
import { prismaClient } from '@/database';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || '123';
const isProd = process.env.NODE_ENV === 'production';

export async function POST(req: Request) {
    const { email, password } = await req.json();
    console.log("req in login" , email , password)
console.log("0")
    if (!email || !password) {
        return NextResponse.json(
            { message: 'Missing required fields' },
            { status: 400 }
        );
    }
    console.log("1 : mail  : " , email)
    try {
        // Check the user table for any user with this email
        const user = await prismaClient.user.findUnique({
            where: { email }
        });
        console.log("2 , " , user)
        // If no user was found
        if (!user) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            );
        }
console.log("3")
        const isValidPassword = password === user.password;

        if (!isValidPassword) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            );
        }
console.log("4")
        const token = jwt.sign(
            { id: user.id, role: user.role, branch_id: user.branchId },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        const res = NextResponse.json({ success: true });
        res.cookies.set('token', token, {
            httpOnly: true,
            secure: isProd,
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });
        return res;
    } catch (error) {
        console.error('Error in login API:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}