// pages/api/login.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { query } from "@/database/db"
import jwt from 'jsonwebtoken';
import { Client, Staff } from "@/src/types"
import { NextResponse } from 'next/server';

const JWT_SECRET = '123';

export async function POST(req: Request, res: NextResponse) {

    const { email, password } = await req.json();

    if (!email || !password) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    try {
        const clients = await query(
            'SELECT * FROM client WHERE email = ?',
            [email]
        ) as Client[];

        let user: Client | Staff | null = null;

        if (Array.isArray(clients) && clients.length > 0) {
            user = clients[0];
        } else {
            const staff = await query(
                'SELECT * FROM staff WHERE email = ?',
                [email]
            )as Staff[];

            if (Array.isArray(staff) && staff.length > 0) {
                user = staff[0];
            }
        }

        if (!user) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        const isValidPassword = password ===  user.password;

        if (!isValidPassword) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        const token = jwt.sign(
            { id: user.id  , role: user.role }, 
            JWT_SECRET
        );
        return NextResponse.json({ token : token }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}