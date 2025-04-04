import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/database/db';

// GET /api/notifications - Get user notifications
export async function GET(req: NextRequest) {
  try {
    const user_id = req.headers.get('x-user-id'); 
    
    const notifications = await query(
      `SELECT * FROM notifications 
       WHERE user_id = ? 
       ORDER BY created_at DESC
       LIMIT 50`,
      [user_id]
    );

    return NextResponse.json(notifications, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await query(
      `UPDATE notifications SET is_read = TRUE WHERE id = ?`,
      [params.id]
    );

    return NextResponse.json(
      { message: 'Notification marked as read' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to update notification' },
      { status: 500 }
    );
  }
}