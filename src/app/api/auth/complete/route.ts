import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/src/lib/auth';
import { prismaClient } from '@/database';

const ALLOWED_ROLES = ['client','manager','supervisor','assistant'];

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const { role, branchId } = await req.json();

    if (!role || !ALLOWED_ROLES.includes(role)) {
      return NextResponse.json({ message: 'Invalid role' }, { status: 400 });
    }

    if (role !== 'client') {
      if (!branchId) {
        return NextResponse.json({ message: 'Branch required for staff roles' }, { status: 400 });
      }
      const branch = await prismaClient.branch.findUnique({ where: { id: Number(branchId) } });
      if (!branch) {
        return NextResponse.json({ message: 'Invalid branchId' }, { status: 400 });
      }
    }

    const update = await prismaClient.user.update({
      where: { id: Number(session.user.id) },
      data: {
        role,
        branchId: role === 'client' ? null : branchId ? Number(branchId) : null,
      },
      select: { id: true, role: true, branchId: true }
    });

    return NextResponse.json({ message: 'Profile completed', user: update });
  } catch (e) {
    console.error('complete registration error', e);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}