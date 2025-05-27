import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth/[...nextauth]/options';

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        return NextResponse.json({ 
            success: true, 
            message: 'Notification marked as read',
            notificationId: params.id
        });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
} 