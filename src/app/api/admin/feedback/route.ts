import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth/[...nextauth]/options';
import dbConnect from '@/helpers/dbconnect';
import Feedback from '@/models/feedback.model';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const feedbacks = await Feedback.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'username')
      .lean();

    // Transform the data to include username
    const transformedFeedbacks = feedbacks.map(feedback => ({
      ...feedback,
      username: feedback.userId?.username || 'Unknown User',
      userId: feedback.userId?._id
    }));

    return NextResponse.json({ feedbacks: transformedFeedbacks });
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feedbacks' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const feedbackId = searchParams.get('id');
    if (!feedbackId) {
      return NextResponse.json(
        { error: 'Feedback ID is required' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { status } = body;

    if (!status || !['pending', 'in-progress', 'resolved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    await dbConnect();

    const feedback = await Feedback.findByIdAndUpdate(
      feedbackId,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!feedback) {
      return NextResponse.json(
        { error: 'Feedback not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error('Error updating feedback:', error);
    return NextResponse.json(
      { error: 'Failed to update feedback' },
      { status: 500 }
    );
  }
} 