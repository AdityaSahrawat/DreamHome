import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/database/db';
import { authenticateToken } from '@/src/middleware';
import { Property } from '@/src/types';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {

        const authResult = await authenticateToken(req);

        if (authResult instanceof NextResponse) {
            return authResult;
        }
        const applicationId = await params.id;

        const { role, branch_id } = authResult;

        if (role !== 'manager') {
            return NextResponse.json(
                { message: 'Insufficient permissions' },
                { status: 403 }
            );
        }

        const { status, assistantId } = await req.json();
        console.log("body : " , status , assistantId)
        console.log("id : " , applicationId)

        if (!status || !['approved', 'rejected'].includes(status)) {
            return NextResponse.json(
                { message: 'Invalid status. Must be "approved" or "rejected".' },
                { status: 400 }
            );
        }
        console.log("2")
        if (status === 'approved' && !assistantId) {
            return NextResponse.json(
                { message: 'Assistant ID is required for approval' },
                { status: 400 }
            );
        }

        
        console.log("3")
        const applications = await query(
            'SELECT * FROM properties WHERE id = ? AND branch_id = ?',
            [applicationId, branch_id]
        ) as Property[]
        const application = applications[0]
        if (!application) {
            return NextResponse.json(
                { message: 'Property application not found' },
                { status: 404 }
            );
        }

        // await query(
        //     'UPDATE properties SET status = ? WHERE id = ?',
        //     [status, applicationId]
        // );

        if (status === 'approved') {
            await query(
                'UPDATE properties SET status = ? , agent_id = ? WHERE id = ?' ,
                [status, assistantId , applicationId]
            )
        }else if (status === "rejected"){
            await query(
                'UPDATE properties SET status = ? WHERE id = ?' ,
                [status , applicationId]
            )
        }else {
            return NextResponse.json(
                {message : 'Wrong status type given '},
                {status : 420}
            )
        }
        return NextResponse.json(
            { message: `Property application ${status} successfully` },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error in PUT /api/property/[applicationId]:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}