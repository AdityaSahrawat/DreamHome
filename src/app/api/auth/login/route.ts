import { NextResponse } from 'next/server';
import { query } from '@/database/db';
import jwt from 'jsonwebtoken';
import { Client, Staff, Owner } from '@/src/types';

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
        // Check the client table
        const [client] = await query(
            'SELECT * FROM client WHERE email = ?',
            [email]
        ) as Client[];

        let user: Client | Staff | Owner | null = client;

        if (!user) {
            // Check the staff table
            const [staff] = await query(
                'SELECT * FROM staff WHERE email = ?',
                [email]
            ) as Staff[];

            user = staff;

            if (!user) {
                // Check the owner table
                const [owner] = await query(
                    'SELECT * FROM owners WHERE email = ?',
                    [email]
                ) as Owner[];

                user = owner;
            }
        }

        // If no user was found in any table
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
            { id: user.id, role: user.role, branch_id: user.branch_id },
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