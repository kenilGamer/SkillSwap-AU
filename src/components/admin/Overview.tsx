'use client';

import { Card } from '@/components/ui/card';
import { getStats } from '@/lib/admin';

export async function Overview() {
  const stats = await getStats();

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">System Overview</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Users</span>
          <span className="font-medium">{stats.totalUsers}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Active Users</span>
          <span className="font-medium">{stats.activeUsers}</span>
        </div>
      </div>
    </Card>
  );
} 