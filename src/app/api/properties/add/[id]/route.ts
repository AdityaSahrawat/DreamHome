import { NextRequest, NextResponse } from 'next/server';

import { prismaClient } from '@/database';
import { authenticateToken } from '@/src/middleware';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {


        const authResult = await authenticateToken(req);
        if (authResult instanceof NextResponse) {
            return authResult;
        }
        const applicationId = params.id;
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
        const application = await prismaClient.property.findFirst({
            where: {
                id: Number(applicationId),
                branchId: branch_id
            }
        });
        if (!application) {
            return NextResponse.json(
                { message: 'Property application not found' },
                { status: 404 }
            );
        }

        if (status === 'approved') {
            await prismaClient.property.update({
                where: { id: Number(applicationId) },
                data: {
                    status,
                    agentId: assistantId
                }
            });
        } else if (status === 'rejected') {
            await prismaClient.property.update({
                where: { id: Number(applicationId) },
                data: { status }
            });
        } else {
            return NextResponse.json(
                { message: 'Wrong status type given' },
                { status: 420 }
            );
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