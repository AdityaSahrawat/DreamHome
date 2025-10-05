import { NextRequest, NextResponse } from 'next/server';

import { prismaClient } from '@/database';
import { authenticateToken } from '@/src/middleware';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {


        const authResult = await authenticateToken(req);
        if (authResult instanceof NextResponse) return authResult;
        if (!authResult) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        const applicationId = params.id;
        const role = (authResult as { role?: string }).role;
        const branch_id = (authResult as { branch_id?: number | null }).branch_id;
        if (role !== 'manager') {
            return NextResponse.json(
                { message: 'Insufficient permissions' },
                { status: 403 }
            );
        }

        const { status, assistantId } = await req.json();
    // Removed debug log: status, assistantId
    // Removed debug log: applicationId

        if (!status || !['approved', 'rejected'].includes(status)) {
            return NextResponse.json(
                { message: 'Invalid status. Must be "approved" or "rejected".' },
                { status: 400 }
            );
        }
    // Removed debug log marker
        if (status === 'approved' && !assistantId) {
            return NextResponse.json(
                { message: 'Assistant ID is required for approval' },
                { status: 400 }
            );
        }

        
    // Removed debug log marker
        const application = await prismaClient.property.findFirst({
            where: {
                id: Number(applicationId),
                branchId: branch_id ?? undefined
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
                    agentId: Number(assistantId)
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