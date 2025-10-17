import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/database';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET!

export async function POST(req: NextRequest) {
    try {
        const { email, code, password, name } = await req.json();
        if (!email || !code || !password || !name) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }

        // Find verification email
        const verificationEmail = await prismaClient.verificationEmail.findFirst({
            where: { email }
        });

        if (!verificationEmail) {
            return NextResponse.json(
                { message: "Email verification not found" },
                { status: 404 }
            );
        }

        // Check if code matches
        if (verificationEmail.code !== code) {
            return NextResponse.json(
                { message: "Invalid verification code" },
                { status: 400 }
            );
        }

        // Check if code is expired
        if (verificationEmail.expireAt < new Date()) {
            return NextResponse.json(
                { message: "Verification code expired. Please request a new one." },
                { status: 400 }
            );
        }

        // Create user with plain text password
        const user = await prismaClient.user.create({
            data: {
                name,
                email,
                password: password,
                role: "client", // Default role for manual registration
                emailVerified: new Date()
            }
        });

        // Delete verification email
        await prismaClient.verificationEmail.delete({
            where: { id: verificationEmail.id }
        });

        // Create session/token (optional - you can also redirect to login)
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
                message: "User verified and created successfully!",
                token: token, // Include token in response for frontend storage
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                }
            },
            { status: 201 }
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
        console.error("Error verifying code:", error);
        return NextResponse.json(
            { message: "Internal server error", error: error instanceof Error ? error.message : error },
            { status: 500 }
        );
    }
}
