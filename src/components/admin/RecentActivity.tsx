'use client';

import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  username: string;
  skills: string[];
  bio: string;
  country: string;
  plan: string;
  website: string;
  verified: boolean;
  image: string;
  followers: string[];
  following: string[];
  lastActive?: string;
}

interface Feedback {
  type: string;
  message: string;
  rating: number;
  createdAt: string;
}

interface ActivityData {
  users: User[];
  feedback: Feedback[];
}

export function RecentActivity() {
  const [activity, setActivity] = useState<ActivityData>({ users: [], feedback: [] });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await fetch('/api/admin/recent-activity');
        if (!response.ok) {
          throw new Error('Failed to fetch recent activity');
        }
        const data = await response.json();
        setActivity(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch recent activity');
        console.error('Error fetching recent activity:', err);
      }
    };

    fetchActivity();
  }, []);

  if (error) {
    return (
      <Card className="p-6">
        <p className="text-red-500">Error: {error}</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activity.users.map((user) => (
          <div key={user._id} className="flex justify-between items-center">
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <span className="text-sm text-gray-500">
              {user.role}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
} 