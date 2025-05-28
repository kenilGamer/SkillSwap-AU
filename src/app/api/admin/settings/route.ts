import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth/[...nextauth]/options';
import dbConnect from '@/helpers/dbconnect';
import User from '@/models/user.model';
import Settings, { initializeSettings } from '@/models/settings.model';
import { ISettings } from '@/models/settings.model';

// Initialize settings on server start
initializeSettings().catch(console.error);

// GET handler to fetch admin settings
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is an admin
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Get system statistics and settings
    const [totalUsers, verifiedUsers, activeUsers, settings] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ verified: true }),
      User.countDocuments({ lastActive: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }),
      Settings.findOne().lean() as Promise<ISettings | null>
    ]);

    // Return settings data
    return NextResponse.json({
      systemStats: {
        totalUsers,
        verifiedUsers,
        activeUsers
      },
      ...(settings || {}),
      lastUpdated: settings?.lastUpdated || new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching admin settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PUT handler to update admin settings
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is an admin
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate the settings update
    const validSettings = {
      requireEmailVerification: typeof body.requireEmailVerification === 'boolean',
      maintenanceMode: typeof body.maintenanceMode === 'boolean',
      allowNewRegistrations: typeof body.allowNewRegistrations === 'boolean',
      maxUsersPerPage: typeof body.maxUsersPerPage === 'number' && body.maxUsersPerPage > 0
    };

    // Check if all required fields are present and valid
    const isValid = Object.values(validSettings).every(Boolean);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid settings data' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Update settings
    const updatedSettings = await Settings.findOneAndUpdate(
      {},
      {
        ...body,
        lastUpdated: new Date()
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      message: 'Settings updated successfully',
      settings: updatedSettings,
      updatedAt: updatedSettings.lastUpdated
    });
  } catch (error) {
    console.error('Error updating admin settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
} 