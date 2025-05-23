"use client"
import { useState } from 'react';
import { Input } from '@/components/shadcn/ui/input';
import { Textarea } from '@/components/shadcn/ui/textarea';
import { Label } from '@/components/shadcn/ui/label';
import { Button } from '@/components/Button';

interface ForumQuestionFormProps {
  onSubmit: (title: string, description: string) => void;
  loading?: boolean;
}

export default function ForumQuestionForm({ onSubmit, loading }: ForumQuestionFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<{ title?: string; description?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError({
        title: !title.trim() ? 'Title required' : undefined,
        description: !description.trim() ? 'Description required' : undefined,
      });
      return;
    }
    setError({});
    onSubmit(title, description);
    setTitle('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="forum-title">Question Title</Label>
        <Input
          id="forum-title"
          placeholder="Question Title..."
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="mt-1"
        />
        {error.title && <div className="text-xs text-red-500 mt-1">{error.title}</div>}
      </div>
      <div>
        <Label htmlFor="forum-description">Question Details</Label>
        <Textarea
          id="forum-description"
          placeholder="Question Details..."
          value={description}
          onChange={e => setDescription(e.target.value)}
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