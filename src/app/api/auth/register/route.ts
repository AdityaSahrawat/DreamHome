// pages/api/register.ts
// import { query } from "@/database/db"
import { prismaClient } from '@/database';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { name, email, password, role, branch_id } = await req.json();

    if (!name || !email || !password || !role || !branch_id) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    try {
        const existingUser = await prismaClient.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            return NextResponse.json(
                { message: 'Email already exists' },
                { status: 400 }
            );
        }

        if (role === 'client') {
            await prismaClient.user.create({
                data: {
                    name,
                    email,
                    password,
                    role,
                    branchId: branch_id
                }
            });
            return NextResponse.json({ message: "Client registered successfully" }, { status: 201 });
        } else if (['manager', 'supervisor', 'assistant'].includes(role)) {
            await prismaClient.staffApplication.create({
                data: {
                    email,
                    role,
                    branchId: branch_id,
                    tempPassword: password,
                    name
                }
            });
            return NextResponse.json({ message: "Staff application submitted successfully" }, { status: 201 });
        } else {
            return NextResponse.json({ message: "Invalid role" }, { status: 400 });
        }
    } catch (error) {
        console.error("Error in register API:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
