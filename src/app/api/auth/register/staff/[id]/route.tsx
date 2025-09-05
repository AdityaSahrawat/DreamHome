import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/database';
import { authenticateToken } from '@/src/middleware';

// PUT /api/applications/[applicationId] - Accept or reject an application
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        // Authenticate the user
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


        const applicationId = await params.id;

        console.log("applicationId : " , applicationId)
        const application = await prismaClient.staffApplication.findUnique({
            where: { id: Number(applicationId) }
        });
        if (!application) {
            return NextResponse.json(
                { message: 'Application not found' },
                { status: 404 }
            );
        }





        if (role === 'manager') {
            if (application.branchId !== branch_id || !['assistant', 'supervisor'].includes(application.role)) {
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



        await prismaClient.staffApplication.update({
            where: { id: Number(applicationId) },
            data: { status }
        });

        if (status === 'approved') {
            await prismaClient.user.create({
                data: {
                    name: application.name,
                    email: application.email,
                    role: application.role,
                    branchId: application.branchId,
                    password: application.tempPassword ?? ''
                }
            });
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