import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/database';
import jwt from 'jsonwebtoken';

const allowedRoles = ['manager', 'supervisor', 'assistant'];

export async function POST(req: NextRequest) {
    try {
        const { email, name, password, role, branchId } = await req.json();

        // Validate required fields
        if (!email || !name || !password || !role) {
            return NextResponse.json(
                { message: "Email, name, password, and role are required" },
                { status: 400 }
            );
        }

        // Validate role
        if (!allowedRoles.includes(role)) {
            return NextResponse.json(
                { message: `Invalid role. Allowed roles: ${allowedRoles.join(', ')}` },
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

        // Validate branch exists if branchId is provided
        if (branchId) {
            const branch = await prismaClient.branch.findUnique({
                where: { id: parseInt(branchId) }
            });

            if (!branch) {
                return NextResponse.json(
                    { message: "Invalid branch ID" },
                    { status: 400 }
                );
            }
        }

        // Create new staff member
        const newStaff = await prismaClient.user.create({
            data: {
                email,
                name,
                password, // Plain text for now
                role: role as "manager" | "supervisor" | "assistant",
                branchId: branchId ? parseInt(branchId) : null
            },
            include: {
                branch: true
            }
        });

        // Generate JWT token
        const token = jwt.sign(
            { 
                email: newStaff.email, 
                userId: newStaff.id,
                role: newStaff.role 
            },
            process.env.NEXTAUTH_SECRET || "123",
            { expiresIn: '24h' }
        );

        // Create response with httpOnly cookie
        const response = NextResponse.json(
            { 
                message: `${role.charAt(0).toUpperCase() + role.slice(1)} created successfully`,
                user: {
                    id: newStaff.id,
                    email: newStaff.email,
                    name: newStaff.name,
                    role: newStaff.role,
                    branch: newStaff.branch
                }
            },
            { status: 201 }
        );

        response.cookies.set("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 // 24 hours
        });

        return response;

    } catch (error) {
        console.error("Error creating staff member:", error);
        return NextResponse.json(
            { 
                message: "Internal server error", 
                error: error instanceof Error ? error.message : error 
            },
            { status: 500 }
        );
    }
}
