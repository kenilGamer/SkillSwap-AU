import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Notification } from '@/models/Notification';
import { initSocket } from '@/lib/socket';
import { authOptions } from '@/auth/[...nextauth]/options';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const notifications = await Notification.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(20);

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { type, title, message, data, userId } = body;

    const notification = await Notification.create({
      userId,
      type,
      title,
      message,
      data,
    });

    // Emit real-time notification
    const io = initSocket(req as any);
    io?.to(userId).emit('notification', notification);

    return NextResponse.json(notification);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { notificationId } = await req.json();
    
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId: session.user.id },
      { read: true },
      { new: true }
    );

    return NextResponse.json(notification);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Delete all notifications for the user from your database

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete notifications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 