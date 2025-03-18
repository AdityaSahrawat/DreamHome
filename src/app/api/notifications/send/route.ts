// pages/api/notification/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/database/db';
import { authenticateToken } from '@/src/middleware';

export async function GET(request: NextRequest) {
    try {
        const authResult = await authenticateToken(request);

        if (authResult instanceof NextResponse) {
            return authResult; 
        }

        const user = authResult;

        let notifications;
        if (user.role === 'owner') {
            notifications = await query(
                'SELECT * FROM notifications'
            );
        } else if (user.role === 'manager') {
            notifications = await query(
                `SELECT n.* FROM notifications n
                 JOIN staff s ON n.id = s.id
                 WHERE s.branch_id = ? AND n.role = 'manager'`,
                [user.id]
            );
        } else if (user.role === 'client') {
            notifications = await query(
                `SELECT * FROM notifications WHERE id = ? AND role = 'client'`,
                [user.id]
            );
        } else {
            return NextResponse.json(
                { message: 'Insufficient permissions' },
                { status: 403 }
            );
        }

        return NextResponse.json(notifications);
    } catch (error) {
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const authResult = await authenticateToken(request);

        if (authResult instanceof NextResponse) {
            return authResult;
        }

        const user = authResult;

        if (user.role !== 'owner' && user.role !== 'manager') {
            return NextResponse.json(
                { message: 'Insufficient permissions' },
                { status: 403 }
            );
        }

        const { userId, role, message } = await request.json();

        if (!userId || !role || !message) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        await query(
            'INSERT INTO notifications (user_id, user_type, message) VALUES (?, ?, ?)',
            [userId, role, message]
        );

        return NextResponse.json(
            { message: 'Notification sent successfully' },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}