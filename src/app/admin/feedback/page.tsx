'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Check, X, Filter } from 'lucide-react';
import { toast } from 'sonner';

interface Feedback {
  id: string;
  userId: string;
  username: string;
  type: 'bug' | 'feature' | 'improvement' | 'other';
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'resolved' | 'rejected'>('all');

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch('/api/admin/feedback');
      const data = await response.json();
      if (data.feedbacks) {
        setFeedbacks(data.feedbacks);
      }
    } catch (error) {
      console.error('Failed to fetch feedbacks:', error);
      toast.error('Failed to load feedbacks');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (feedbackId: string, newStatus: Feedback['status']) => {
    try {
      const response = await fetch(`/api/admin/feedback/${feedbackId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setFeedbacks(feedbacks.map(feedback =>
          feedback.id === feedbackId ? { ...feedback, status: newStatus } : feedback
        ));
        toast.success('Feedback status updated');
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Failed to update feedback status:', error);
      toast.error('Failed to update status');
    }
  };

  const filteredFeedbacks = feedbacks.filter(feedback => 
    filter === 'all' ? true : feedback.status === filter
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Feedback Management</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-4">Loading feedbacks...</div>
          ) : filteredFeedbacks.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No feedback</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filter === 'all' 
                  ? 'No feedback has been submitted yet.'
                  : `No ${filter} feedback found.`}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left">User</th>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Title</th>
                    <th className="px-4 py-2 text-left">Description</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFeedbacks.map((feedback) => (
                    <tr key={feedback.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{feedback.username}</td>
                      <td className="px-4 py-2">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                          ${feedback.type === 'bug' ? 'bg-red-100 text-red-700' :
                            feedback.type === 'feature' ? 'bg-blue-100 text-blue-700' :
                            feedback.type === 'improvement' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'}`}>
                          {feedback.type}
                        </span>
                      </td>
                      <td className="px-4 py-2">{feedback.title}</td>
                      <td className="px-4 py-2 max-w-xs truncate">{feedback.description}</td>
                      <td className="px-4 py-2">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                          ${feedback.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            feedback.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                            feedback.status === 'resolved' ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'}`}>
                          {feedback.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-500">
                        {new Date(feedback.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex gap-2">
                          {feedback.status === 'pending' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusUpdate(feedback.id, 'in-progress')}
                                className="h-8 px-2"
                              >
                                Start
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusUpdate(feedback.id, 'rejected')}
                                className="h-8 px-2 text-red-600 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          {feedback.status === 'in-progress' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusUpdate(feedback.id, 'resolved')}
                                className="h-8 px-2 text-green-600 hover:text-green-700"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusUpdate(feedback.id, 'rejected')}
                                className="h-8 px-2 text-red-600 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
} 