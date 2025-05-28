'use client';

import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';

interface Stats {
  totalUsers: number;
  activeUsers: number;
  avgResponseTime: number;
}

export function Overview() {
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