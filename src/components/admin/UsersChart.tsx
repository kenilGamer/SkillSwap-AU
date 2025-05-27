'use client';

import { Card } from '@/components/ui/card';
import { getStats } from '@/lib/admin';

export async function UsersChart() {
  const stats = await getStats();

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">User Statistics</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-600">Total Users</p>
          <p className="text-2xl font-semibold">{stats.totalUsers}</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-600">Active Today</p>
          <p className="text-2xl font-semibold">{stats.activeUsers}</p>
        </div>
      </div>
    </Card>
  );
} 