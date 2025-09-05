import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/database';

// GET /api/notifications - Get user notifications
export async function GET(req: NextRequest) {
  try {
    const user_id = req.headers.get('x-user-id'); 
    
    if (!user_id) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      );
    }
    
    const notifications = await prismaClient.notification.findMany({
      where: { userId: parseInt(user_id) },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    return NextResponse.json(notifications, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    return NextResponse.json(
      { message: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prismaClient.notification.update({
      where: { id: parseInt(params.id) },
      data: { isRead: true }
    });

    return NextResponse.json(
      { message: 'Notification marked as read' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to update notification:', error);
    return NextResponse.json(
      { message: 'Failed to update notification' },
      { status: 500 }
    );
  }
}