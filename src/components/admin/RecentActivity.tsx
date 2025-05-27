'use client';

import { Card } from '@/components/ui/card';
import { getRecentActivity } from '@/lib/admin';

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
}

export async function RecentActivity() {
  const { users, feedback } = await getRecentActivity();

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {users.map((user: User) => (
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