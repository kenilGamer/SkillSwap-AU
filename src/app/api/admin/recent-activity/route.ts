import { NextResponse } from 'next/server';
import { getRecentActivity } from '@/lib/admin';

export async function GET() {
  try {
    const activity = await getRecentActivity();
    return NextResponse.json(activity);
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent activity' },
      { status: 500 }
    );
  }
} 