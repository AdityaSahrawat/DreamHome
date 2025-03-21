import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/database/db';
import { authenticateToken } from '@/src/middleware';
import { StaffApplication } from '@/src/types';


export async function GET(request: NextRequest) {
    try {
        console.log("notif 0")
        const authResult = await authenticateToken(request);


        if (authResult instanceof NextResponse) {
            console.log(authResult)
            return authResult;
        }
        const { id, role, branch_id } = authResult;
        console.log("notif 1")
        const notifications = await query(
            'SELECT * FROM notifications WHERE user_id = ? AND role = ?',
            [id, role]
        );


        let staffApplications;
        if (role === 'owner') {
            console.log("notif 2")
            staffApplications = await query(
                'SELECT * FROM StaffApplications WHERE status = ?  AND role = ?',
                ['pending' , 'manager']
            ) as StaffApplication[]
        } else if (role === 'manager') {
            staffApplications = await query(
                `SELECT * FROM StaffApplications
                 WHERE branch_id = ? AND role IN ('assistant', 'supervisor') AND status = ?`,
                [branch_id, 'pending']
            ) as StaffApplication[]
        }
        console.log("notif 3")
        const response = {
            notifications,
            staffApplications: role === 'owner' || role === 'manager' ? staffApplications : [],
        };


        return NextResponse.json(response);
    } catch (error) {
        console.error('Error in GET /notification:', error);
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


        const { role } = authResult;


        if (role !== 'owner' && role !== 'manager') {
            return NextResponse.json(
                { message: 'Insufficient permissions' },
                { status: 403 }
            );
        }


        const { userId, userType, message } = await request.json();


        if (!userId || !userType || !message) {
            return NextResponse.json(
                { message: 'Missing required fields: userId, userType, or message' },
                { status: 400 }
            );
        }


        await query(
            'INSERT INTO notifications (user_id, role, message) VALUES (?, ?, ?)',
            [userId, userType, message]
        );


        return NextResponse.json(
            { message: 'Notification sent successfully' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error in POST /notification:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
