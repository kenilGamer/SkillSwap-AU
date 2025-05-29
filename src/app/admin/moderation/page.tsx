'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, Flag, Ban } from 'lucide-react';
import { toast } from 'sonner';

interface Report {
  id: string;
  type: 'user' | 'content';
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
  reportedBy: {
    name: string;
    email: string;
  };
  reportedItem: {
    id: string;
    type: string;
    content?: string;
  };
}

export default function ModerationPage() {
  const [reports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch reports from API
    setLoading(false);
  }, []);

  const handleAction = async (reportId: string, action: 'resolve' | 'dismiss') => {
    try {
      // TODO: Implement moderation actions
      toast.success(`Report ${action === 'resolve' ? 'resolved' : 'dismissed'}`);
    } catch (error) {
      toast.error('Failed to process report');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Moderation</h1>
        <Button variant="outline" className="gap-2">
          <Shield className="w-4 h-4" />
          Moderation Guidelines
        </Button>
      </div>

      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reports" className="gap-2">
            <Flag className="w-4 h-4" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="bans" className="gap-2">
            <Ban className="w-4 h-4" />
            Banned Users
          </TabsTrigger>
          <TabsTrigger value="flagged" className="gap-2">
            <AlertTriangle className="w-4 h-4" />
            Flagged Content
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reports">
          <Card className="p-6">
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-4">Loading reports...</div>
              ) : reports.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No reports to review
                </div>
              ) : (
                reports.map((report) => (
                  <div
                    key={report.id}
                    className="border rounded-lg p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">
                          {report.type === 'user' ? 'User Report' : 'Content Report'}
                        </p>
                        <p className="text-sm text-gray-500">{report.reason}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAction(report.id, 'dismiss')}
                        >
                          Dismiss
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleAction(report.id, 'resolve')}
                        >
                          Resolve
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      Reported by {report.reportedBy.name} ({report.reportedBy.email})
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="bans">
          <Card className="p-6">
            <div className="text-center py-4 text-gray-500">
              Banned users list will be implemented here
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="flagged">
          <Card className="p-6">
            <div className="text-center py-4 text-gray-500">
              Flagged content list will be implemented here
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 