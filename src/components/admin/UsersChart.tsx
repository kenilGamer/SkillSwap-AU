'use client';

import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';

interface Stats {
  totalUsers: number;
  activeUsers: number;
  avgResponseTime: number;
}

export function UsersChart() {
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, activeUsers: 0, avgResponseTime: 0 });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
        console.error('Error fetching stats:', err);
      }
    };

    fetchStats();
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