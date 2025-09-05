import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/database';
import { authenticateToken } from '@/src/middleware';

export async function GET() {
    try {
        const branches = await prismaClient.branch.findMany({
            orderBy: {
                name: 'asc'
            }
        });

        return NextResponse.json(
            { 
                message: "Branches fetched successfully",
                branches 
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error fetching branches:", error);
        return NextResponse.json(
            { 
                message: "Internal server error", 
                error: error instanceof Error ? error.message : error 
            },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        // Authenticate and authorize only owners
        const authResult = await authenticateToken(req);

        if (authResult instanceof NextResponse) {
            return authResult;
        }

        const { role } = authResult;

        // Only owners can create branches
        if (role !== 'owner') {
            return NextResponse.json(
                { message: "Only owners can create branches" },
                { status: 403 }
            );
        }

        const { name, location } = await req.json();

        if (!name || !location) {
            return NextResponse.json(
                { message: "Name and location are required" },
                { status: 400 }
            );
        }

        // Check if branch with same name already exists
        const existingBranch = await prismaClient.branch.findFirst({
            where: { name }
        });

        if (existingBranch) {
            return NextResponse.json(
                { message: "A branch with this name already exists" },
                { status: 409 }
            );
        }

        const newBranch = await prismaClient.branch.create({
            data: {
                name,
                location
            }
        });

        return NextResponse.json(
            { 
                message: "Branch created successfully",
                branch: newBranch 
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Error creating branch:", error);
        return NextResponse.json(
            { 
                message: "Internal server error", 
                error: error instanceof Error ? error.message : error 
            },
            { status: 500 }
        );
    }
}
