import { NextResponse } from 'next/server';
import { prismaClient } from '@/database';
import jwt from 'jsonwebtoken';

const JWT_SECRET = '123';

export async function POST(req: Request) {
    const { email, password } = await req.json();
    console.log("req in login" , email , password)

    if (!email || !password) {
        return NextResponse.json(
            { message: 'Missing required fields' },
            { status: 400 }
        );
    }

    try {
        // Check the user table for any user with this email
        const user = await prismaClient.user.findUnique({
            where: { email: email }
        });

        // If no user was found
        if (!user) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const isValidPassword = password === user.password;

        if (!isValidPassword) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, branch_id: user.branchId },
            JWT_SECRET,
        );

        return NextResponse.json({ token });
    } catch (error) {
        console.error('Error in login API:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}