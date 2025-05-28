import { NextResponse } from 'next/server';
import dbConnect from '@/helpers/dbconnect';
import User from '@/models/user.model';
import { Feedback } from '@/models/Feedback';

export async function GET() {
  try {
    await dbConnect();

    // Get user statistics
    const [
      totalUsers,
      activeUsers,
      newUsersToday,
      verifiedUsers,
      userRoles,
      userCountries,
      feedbackStats,
    ] = await Promise.all([
      // Total users
      User.countDocuments(),
      
      // Active users in last 24 hours
      User.countDocuments({ lastActive: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }),
      
      // New users today
      User.countDocuments({ createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }),
      
      // Verified users
      User.countDocuments({ verified: true }),
      
      // User roles distribution
      User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      
      // User countries distribution with better handling of empty values
      User.aggregate([
        {
          $group: {
            _id: {
              $cond: [
                { $or: [
                  { $eq: ['$country', ''] },
                  { $eq: ['$country', null] },
                  { $not: '$country' }
                ]},
                'Not Specified',
                '$country'
              ]
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      
      // Feedback statistics
      Feedback.aggregate([
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 },
            avgRating: { $avg: '$rating' }
          }
        },
        { $sort: { count: -1 } }
      ])
    ]);

    // Process countries data to ensure consistent formatting
    const processedCountries = userCountries.map(country => ({
      ...country,
      _id: country._id === 'Not Specified' ? 'Not Specified' : 
           country._id.trim() || 'Not Specified'
    }));

    return NextResponse.json({
      users: {
        total: totalUsers,
        active: activeUsers,
        newToday: newUsersToday,
        verified: verifiedUsers,
        roles: userRoles,
        countries: processedCountries
      },
      feedback: feedbackStats
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
} 