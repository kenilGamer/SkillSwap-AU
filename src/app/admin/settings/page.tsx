'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Settings,
  Users,
  Shield,
  Save,
  AlertCircle,
} from 'lucide-react';

interface SettingsData {
  systemStats: {
    totalUsers: number;
    verifiedUsers: number;
    activeUsers: number;
  };
  maintenanceMode: boolean;
  allowNewRegistrations: boolean;
  requireEmailVerification: boolean;
  maxUsersPerPage: number;
  lastUpdated: string;
}

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/settings', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Failed to fetch settings');
      }
      
      const data = await response.json();
      setSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch settings');
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/');
      return;
    }

    if (status === 'authenticated' && session?.user?.role === 'admin') {
      fetchSettings();
    }
  }, [status, session, router, fetchSettings]);

  const handleToggle = (setting: keyof SettingsData) => {
    if (settings) {
      setSettings({
        ...settings,
        [setting]: !settings[setting]
      });
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (settings) {
      const numValue = parseInt(e.target.value, 10);
      if (!isNaN(numValue) && numValue > 0) {
        setSettings({
          ...settings,
          maxUsersPerPage: numValue
        });
      }
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Failed to update settings');
      }

      toast.success('Settings updated successfully');
      await fetchSettings();
    } catch (err) {
      toast.error('Failed to update settings');
      console.error('Error updating settings:', err);
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="p-6">
        <p>Loading...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <p>Loading settings...</p>
      </div>
    );
  }

  if (error || !settings) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 text-red-500">
          <AlertCircle className="w-5 h-5" />
          <p>Error: {error || 'Failed to load settings'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Admin Settings</h1>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          System Statistics
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-4 h-4" />
              <span>Total Users</span>
            </div>
            <p className="text-2xl font-semibold mt-2">{settings.systemStats.totalUsers}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-gray-600">
              <Shield className="w-4 h-4" />
              <span>Verified Users</span>
            </div>
            <p className="text-2xl font-semibold mt-2">{settings.systemStats.verifiedUsers}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-4 h-4" />
              <span>Active Users (24h)</span>
            </div>
            <p className="text-2xl font-semibold mt-2">{settings.systemStats.activeUsers}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          General Settings
        </h2>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Maintenance Mode</h3>
              <p className="text-sm text-gray-500">Enable to put the system in maintenance mode</p>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onCheckedChange={() => handleToggle('maintenanceMode')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Allow New Registrations</h3>
              <p className="text-sm text-gray-500">Enable or disable new user registrations</p>
            </div>
            <Switch
              checked={settings.allowNewRegistrations}
              onCheckedChange={() => handleToggle('allowNewRegistrations')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Require Email Verification</h3>
              <p className="text-sm text-gray-500">Require email verification for new users</p>
            </div>
            <Switch
              checked={settings.requireEmailVerification}
              onCheckedChange={() => handleToggle('requireEmailVerification')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Users Per Page</h3>
              <p className="text-sm text-gray-500">Maximum number of users to display per page</p>
            </div>
            <Input
              type="number"
              value={settings.maxUsersPerPage}
              onChange={handleNumberChange}
              className="w-24"
              min={1}
            />
          </div>
        </div>
      </Card>

      <div className="text-sm text-gray-500">
        Last updated: {new Date(settings.lastUpdated).toLocaleString()}
      </div>
    </div>
  );
}