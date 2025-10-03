import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/database';
import jwt from 'jsonwebtoken';

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET environment variable is required');
}
const JWT_SECRET = process.env.NEXTAUTH_SECRET;

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password are required" },
                { status: 400 }
            );
        }

        // Find user
        const user = await prismaClient.user.findFirst({
            where: { 
                email
                // TODO: Add provider field to distinguish manual vs OAuth users
            }
        });

        if (!user || !user.password) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Verify password (plain text comparison)
        const isPasswordValid = password === user.password;

        if (!isPasswordValid) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                email: user.email, 
                userId: user.id,
                role: user.role,
                branchId: user.branchId
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        const response = NextResponse.json(
            { 
                message: "Login successful",
                token: token, // Include token in response for frontend storage
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    branchId: user.branchId
                }
            },
            { status: 200 }
        );

        // Set httpOnly cookie
        response.cookies.set('token', token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return response;

    } catch (error) {
        console.error("Error during login:", error);
        return NextResponse.json(
            { message: "Internal server error", error: error instanceof Error ? error.message : error },
            { status: 500 }
        );
    }
}
