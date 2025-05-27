import dbConnect from '@/helpers/dbconnect';
import User from '@/models/user.model';
import { Feedback } from '@/models/Feedback';

export async function getStats() {
  await dbConnect();

  const [
    totalUsers,
    activeUsers,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ lastActive: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }),
  ]);

  return {
    totalUsers,
    activeUsers,
    avgResponseTime: 0 // Placeholder value since we don't have response time tracking yet
  };
}

export async function getRecentActivity(limit = 10) {
  await dbConnect();

  const [users, feedback] = await Promise.all([
    User.find()
      .sort({ lastActive: -1 })
      .limit(limit)
      .select('name email lastActive')
      .lean(),
    Feedback.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('type message rating createdAt')
      .lean(),
  ]);

  return {
    users,
    feedback,
  };
}

export async function getUserStats(userId: string) {
  await dbConnect();

  const [user, feedback] = await Promise.all([
    User.findById(userId).lean(),
    Feedback.find({ userId }).sort({ createdAt: -1 }).lean(),
  ]);

  return {
    user,
    feedback,
  };
}

export async function getFeedbackStats() {
  await dbConnect();

  const stats = await Feedback.aggregate([
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
    { $sort: { count: -1 } },
  ]);

  return stats;
} 