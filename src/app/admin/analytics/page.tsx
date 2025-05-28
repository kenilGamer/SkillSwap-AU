'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import {
  Users,
  UserCheck,
  UserPlus,
  Globe,
  MessageSquare,
  Star,
  MapPin,
} from 'lucide-react';

interface AnalyticsData {
  users: {
    total: number;
    active: number;
    newToday: number;
    verified: number;
    roles: Array<{ _id: string; count: number }>;
    countries: Array<{ _id: string; count: number }>;
  };
  feedback: Array<{
    _id: string;
    count: number;
    avgRating: number;
  }>;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/admin/analytics');
        if (!response.ok) {
          throw new Error('Failed to fetch analytics');
        }
        const analyticsData = await response.json();
        setData(analyticsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const renderCountryName = (countryId: string) => {
    if (countryId === 'Not Specified') {
      return (
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">Not Specified</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-gray-400" />
        <span className="text-gray-600">{countryId}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <p>Loading analytics...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6">
        <p className="text-red-500">Error: {error || 'Failed to load analytics'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Analytics Dashboard</h1>
      </div>

      {/* User Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">{data.users.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Today</p>
              <p className="text-2xl font-semibold text-gray-900">{data.users.active}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">New Today</p>
              <p className="text-2xl font-semibold text-gray-900">{data.users.newToday}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <UserPlus className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Verified Users</p>
              <p className="text-2xl font-semibold text-gray-900">{data.users.verified}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* User Roles and Countries */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">User Roles</h3>
          <div className="space-y-4">
            {data.users.roles.map((role) => (
              <div key={role._id} className="flex justify-between items-center">
                <span className="text-gray-600">{role._id}</span>
                <span className="font-medium">{role.count}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Countries</h3>
          <div className="space-y-4">
            {data.users.countries.map((country) => (
              <div key={country._id} className="flex justify-between items-center">
                {renderCountryName(country._id)}
                <span className="font-medium">{country.count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Feedback Statistics */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Feedback Statistics</h3>
        <div className="space-y-4">
          {data.feedback.map((item) => (
            <div key={item._id} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">{item._id}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                  Avg Rating: {item.avgRating.toFixed(1)}
                </span>
                <span className="font-medium">{item.count} feedback</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
} 