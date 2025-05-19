'use client'
import React, { useState, useEffect } from 'react';
import ForumQuestionForm from '@/components/root/ForumQuestionForm';
import ForumQuestionCard from '@/components/root/ForumQuestionCard';
import userStore from '@/store/user.store';
import { useSnapshot } from 'valtio';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/shadcn/ui/dialog';
import { Button } from '@/components/Button';

interface ForumQuestion {
  id: number;
  title: string;
  description: string;
  userName: string;
  userAvatarUrl?: string;
  createdAt: Date | string;
}

interface ForumAnswer {
  userName: string;
  text: string;
  userAvatarUrl?: string;
  createdAt?: string;
}

function formatDate(date: Date | string) {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function ForumPage() {
  const [questions, setQuestions] = useState<ForumQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, ForumAnswer[]>>({});
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const snap = useSnapshot(userStore);
  const user = snap.user;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function fetchQuestions() {
      setLoading(true);
      const res = await fetch('/api/forum/questions');
      const data = await res.json();
      setQuestions(data);
      setLoading(false);
    }
    fetchQuestions();
  }, []);

  // Fetch answers for all questions from MongoDB
  useEffect(() => {
    async function fetchAllAnswers() {
      const allAnswers: Record<number, ForumAnswer[]> = {};
      for (const q of questions) {
        const res = await fetch(`/api/forum/answers?questionId=${q.id}`);
        allAnswers[q.id] = await res.json();
      }
      setAnswers(allAnswers);
    }
    if (questions.length > 0) fetchAllAnswers();
  }, [questions]);

  const handleNewQuestion = async (title: string, description: string) => {
    if (!user || !user.name) return;
    setPosting(true);
    const res = await fetch('/api/forum/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, userName: user.name, userAvatarUrl: user.image }),
    });
    const data = await res.json();
    if (data.success && data.question) {
      setQuestions(prev => [data.question, ...prev]);
    }
    setPosting(false);
  };

  const handleAddAnswer = (questionId: number) => async (text: string) => {
    if (!user || !user.name) return;
    const res = await fetch('/api/forum/answers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questionId,
        userName: user.name,
        text,
        userAvatarUrl: user.image,
      }),
    });
    const newAnswer = await res.json();
    setAnswers(prev => ({
      ...prev,
      [questionId]: [...(prev[questionId] || []), newAnswer],
    }));
  };

  if (!mounted) return null;

  return (
    <div className="flex w-full gap-5 overflow-hidden p-5 xl:p-7 ">
      <div className="flex w-full flex-col gap-5 rounded-2xl xl:p-3 xl:shadow-[0px_0px_2px_1px_#00000030] bg-white">
        <h1 className="text-2xl font-medium text-blue-700">Forum / Discussion Board</h1>
        <p className="mb-2 text-gray-700">Here users can ask questions and others can answer them.</p>
        <div className="flex mb-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Ask a Question</Button>
            </DialogTrigger>
            <DialogContent className="p-0">
              <DialogTitle className="text-2xl font-semibold text-gray-800 p-3 text-center">Ask a New Question</DialogTitle>
              {user && user.name ? (
                <div className="p-4">
                  <ForumQuestionForm onSubmit={handleNewQuestion} loading={posting} />
                </div>
              ) : (
                <p className="text-gray-500 p-4">Loading your profile...</p>
              )}
            </DialogContent>
          </Dialog>
        </div>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Latest Questions</h2>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : questions.length === 0 ? (
          <p className="text-gray-500">No questions have been asked yet.</p>
        ) : (
          <ul className="space-y-4">
            {questions.map(q => {
              const createdAtDate = typeof q.createdAt === 'string' ? new Date(q.createdAt) : q.createdAt;
              const userAnswers = answers[q.id] || [];
              return (
                <li key={q.id}>
                  <ForumQuestionCard
                    title={q.title}
                    description={q.description}
                    userName={q.userName}
                    userAvatarUrl={q.userAvatarUrl}
                    createdAt={createdAtDate.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    isNew={Date.now() - createdAtDate.getTime() < 24 * 60 * 60 * 1000}
                    answers={userAnswers}
                    onAddAnswer={handleAddAnswer(q.id)}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div className="hidden h-fit w-80 shrink-0 overflow-hidden rounded-2xl shadow-[0px_0px_2px_1px_#00000030] xl:block bg-white">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Ask a New Question</h2>
          {user && user.name ? (
            <ForumQuestionForm onSubmit={handleNewQuestion} loading={posting} />
          ) : (
            <p className="text-gray-500">Loading your profile...</p>
          )}
        </div>
      </div>
    </div>
  );
} 