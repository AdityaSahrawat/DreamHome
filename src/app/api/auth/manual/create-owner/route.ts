import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/database';

export async function POST(req: NextRequest) {
    try {
        const { email, name, password, branchId } = await req.json();

        // Validate required fields
        if (!email || !name || !password) {
            return NextResponse.json(
                { message: "Email, name, and password are required" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prismaClient.user.findFirst({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "A user already exists with this email" },
                { status: 409 }
            );
        }

        // Create new owner directly in database
        const newOwner = await prismaClient.user.create({
            data: {
                email,
                name,
                password, // Plain text for now
                role: "owner",
                branchId: branchId ? parseInt(branchId) : null,
                emailVerified: new Date() // Mark as verified since no email auth
            },
            include: {
                branch: true
            }
        });

        return NextResponse.json(
            { 
                message: "Owner created successfully",
                user: {
                    id: newOwner.id,
                    email: newOwner.email,
                    name: newOwner.name,
                    role: newOwner.role,
                    branch: newOwner.branch,
                    createdAt: newOwner.createdAt
                }
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Error creating owner:", error);
        return NextResponse.json(
            { 
                message: "Internal server error", 
                error: error instanceof Error ? error.message : error 
            },
            { status: 500 }
        );
    }
}
