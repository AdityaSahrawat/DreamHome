import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/database';
import { authenticateToken } from '@/src/middleware';

// POST /api/auth/register/staff/[id] - Approve or reject a staff application
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await authenticateToken(request);
    if (authResult instanceof NextResponse) return authResult;
    if (!authResult) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (authResult as { role?: string }).role;
    const userBranchId = (authResult as { branch_id?: number | null }).branch_id ?? null;

    const { status } = await request.json();
    if (!status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ message: 'Invalid status. Use approved|rejected.' }, { status: 400 });
    }

    const applicationId = params.id;
    const application = await prismaClient.staffApplication.findUnique({ where: { id: Number(applicationId) } });
    if (!application) {
      return NextResponse.json({ message: 'Application not found' }, { status: 404 });
    }

    // Authorization logic
    if (userRole === 'manager') {
      if (application.branchId !== userBranchId || !['assistant', 'supervisor'].includes(application.role)) {
        return NextResponse.json({ message: 'Insufficient permissions' }, { status: 403 });
      }
    } else if (userRole !== 'owner') {
      return NextResponse.json({ message: 'Insufficient permissions' }, { status: 403 });
    }

    await prismaClient.staffApplication.update({ where: { id: Number(applicationId) }, data: { status } });

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

    return NextResponse.json({ message: `Application ${status} successfully` }, { status: 200 });
  } catch (error) {
    console.error('Error in POST /api/auth/register/staff/[id]:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}