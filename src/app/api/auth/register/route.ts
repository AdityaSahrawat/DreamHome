// pages/api/register.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { query } from "@/database/db"
import { NextResponse } from 'next/server';

export async function POST(req: Request, res: NextApiResponse) {
    console.log("1")
    const { name, email, password, role, branch_id } = await req.json();

    if (!name || !email || !password || !role) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    try {
        const user = await query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        console.log(user)
        if (Array.isArray(user) && user.length > 0) {
            return NextResponse.json(
                { message: 'Email already exists' },
                { status: 400 }
            );
        }

        if (role === 'client') { 
            console.log("2")
            await query(
                'INSERT INTO client (name, email, password, branch_id) VALUES (?, ?, ?, ?)',
                [name, email, password, branch_id]
            );
            await query(
                'INSERT INTO users (email, role) VALUES (?, ?)',
                [email, role]
            );
            return NextResponse.json({ message: "Staff application submitted successfully" }, { status: 201 });
        } else if (['manager', 'supervisor', 'assistant'].includes(role)) {
            console.log("3")
            await query(
                'INSERT INTO StaffApplications (role, branch_id, temp_password) VALUES (?, ?, ?)',
                [role, branch_id, password]
            );
            return NextResponse.json({ message: "Staff application submitted successfully" }, { status: 201 });
        } else {
            console.log("4")
            return NextResponse.json({ message: "Invalid role" }, { status: 400 });

        }
    } catch (error) {
        console.log("5")
        console.error("Error in register API:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
