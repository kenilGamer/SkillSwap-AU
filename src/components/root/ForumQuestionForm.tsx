"use client"
import { useState } from 'react';
import { Input } from '@/components/shadcn/ui/input';
import { Textarea } from '@/components/shadcn/ui/textarea';
import { Label } from '@/components/shadcn/ui/label';
import { Button } from '@/components/Button';

interface ForumQuestionFormProps {
  // eslint-disable-next-line no-unused-vars
  onSubmit: (title: string, description: string) => void;
  loading?: boolean;
}

export default function ForumQuestionForm({ onSubmit, loading }: ForumQuestionFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [error, setError] = useState<{ title?: string; description?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id === 'forum-title' ? 'title' : 'description']: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      setError({
        title: !formData.title.trim() ? 'Title required' : undefined,
        description: !formData.description.trim() ? 'Description required' : undefined,
      });
      return;
    }
    setError({});
    onSubmit(formData.title, formData.description);
    setFormData({ title: '', description: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="forum-title">Question Title</Label>
        <Input
          id="forum-title"
          placeholder="Question Title..."
          value={formData.title}
          onChange={handleChange}
          className="mt-1"
        />
        {error.title && <div className="text-xs text-red-500 mt-1">{error.title}</div>}
      </div>
      <div>
        <Label htmlFor="forum-description">Question Details</Label>
        <Textarea
          id="forum-description"
          placeholder="Question Details..."
          value={formData.description}
          onChange={handleChange}
          className="mt-1"
          rows={3}
        />
        {error.description && <div className="text-xs text-red-500 mt-1">{error.description}</div>}
      </div>
      <Button type="submit" loading={loading} className="w-full">
        Post Question
      </Button>
    </form>
  );
}