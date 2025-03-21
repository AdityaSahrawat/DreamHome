import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/database/db';
import { authenticateToken } from '@/src/middleware';
import { StaffApplication } from '@/src/types';


// PUT /api/applications/[applicationId] - Accept or reject an application
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        // Authenticate the user
        console.log("")
        const authResult = await authenticateToken(request);


        if (authResult instanceof NextResponse) {
            return authResult;
        }
        const { role, branch_id } = authResult;


        const { status } = await request.json();


        if (!status || !['approved', 'rejected'].includes(status)) {
            return NextResponse.json(
                { message: 'Invalid status. Must be "approved" or "rejected".' },
                { status: 400 }
            );
        }


        const applicationId = params.id;

        console.log("applicationId : " , applicationId)
        const applications = await query(
            'SELECT * FROM staffApplications WHERE application_id = ?',
            [applicationId]
        ) as StaffApplication[]
       
        if (Array.isArray(applications) && applications.length === 0) {
            return NextResponse.json(
                { message: 'Application not found' },
                { status: 404 }
            );
        }


        const application = applications[0];


        if (role === 'manager') {
            if (application.branch_id  !== branch_id || !['assistant', 'supervisor'].includes(application.role)) {
                return NextResponse.json(
                    { message: 'Insufficient permissions' },
                    { status: 403 }
                );
            }
        } else if (role !== 'owner') {
            return NextResponse.json(
                { message: 'Insufficient permissions' },
                { status: 403 }
            );
        }


        await query(
            'UPDATE StaffApplications SET status = ? WHERE application_id = ?',
            [status, applicationId]
        );


        if (status === 'approved') {
            await query(
                'INSERT INTO staff (name , email, role, branch_id, password) VALUES (?, ?, ?, ? , ?)',
                [application.name , application.email, application.role, application.branch_id, application.password]
            );
        }


        return NextResponse.json(
            { message: `Application ${status} successfully` },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error in PUT /api/applications/[applicationId]:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
