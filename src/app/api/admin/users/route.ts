import { NextResponse } from 'next/server';
import dbConnect from '@/helpers/dbconnect';
import User from '@/models/user.model';

export async function GET() {
  try {
    await dbConnect();
    const users = await User.find()
      .select('name email role username skills bio country plan website verified image followers following lastActive')
      .sort({ lastActive: -1 })
      .lean();

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
} 