'use client'
import React, { useState, useEffect, useMemo } from 'react';
import ForumQuestionForm from '@/components/root/ForumQuestionForm';
import ForumQuestionCard from '@/components/root/ForumQuestionCard';
import userStore from '@/store/user.store';
import { useSnapshot } from 'valtio';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader } from '@/components/shadcn/ui/dialog';
import { Button } from '@/components/Button';
import { FiMessageSquare, FiPlus } from 'react-icons/fi';

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

export default function ForumPage() {
  const [questions, setQuestions] = useState<ForumQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, ForumAnswer[]>>({});
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const snap = useSnapshot(userStore);
  const user = snap.user;
  const [mounted, setMounted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [search, setSearch] = useState("");

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

  // Filtered questions by search
  const filteredQuestions = useMemo(() => {
    if (!search) return questions;
    return questions.filter(q =>
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.description.toLowerCase().includes(search.toLowerCase())
    );
  }, [questions, search]);

  if (!mounted) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 relative">
      {/* Floating Ask Question Button (responsive) */}
      <div>
        {/* Desktop pill button top right */}
        <div className="hidden md:block fixed right-8 top-8 z-30">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="rounded-full px-6 py-3 font-bold shadow-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-all" aria-label="Ask a Question">
                <FiPlus className="inline mr-2 -ml-1 text-lg" /> Ask a Question
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg mx-auto">
              <DialogHeader>
                <DialogTitle>Ask a New Question</DialogTitle>
              </DialogHeader>
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
        {/* Mobile FAB bottom right */}
        <div className="md:hidden fixed right-5 bottom-5 z-30">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="icon" className="rounded-full w-16 h-16 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg flex items-center justify-center text-3xl" aria-label="Ask a Question">
                <FiPlus />
                <span className="sr-only">Ask a Question</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg mx-auto">
              <DialogHeader>
                <DialogTitle>Ask a New Question</DialogTitle>
              </DialogHeader>
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
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center mb-10 text-center">
        <div className="bg-indigo-100 rounded-full p-4 mb-3">
          <FiMessageSquare className="text-indigo-600 text-3xl" />
        </div>
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-2">Forum / Discussion Board</h1>
        <p className="text-lg text-slate-600 max-w-2xl">Ask questions, share knowledge, and help others in the community.</p>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center mb-8">
        <input
          className="w-full max-w-md border border-indigo-200 rounded-full px-5 py-3 text-lg focus:ring-2 focus:ring-indigo-300 shadow-sm transition-all"
          type="search"
          placeholder="Search questions by title or description..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Latest Questions Section */}
      <h2 className="text-2xl font-bold mb-6 text-indigo-700">Latest Questions</h2>
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <span className="text-indigo-500 animate-pulse">Loading questions...</span>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          {/* SVG illustration for empty state */}
          <svg width="120" height="120" fill="none" viewBox="0 0 120 120" className="mb-4">
            <rect width="120" height="120" rx="24" fill="#e0e7ff"/>
            <path d="M40 80h40M40 60h40M40 40h40" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
            <circle cx="60" cy="100" r="6" fill="#6366f1"/>
          </svg>
          <div className="text-slate-500 text-lg">No questions have been asked yet. Be the first to contribute!</div>
        </div>
      ) : (
        <ul className="space-y-6">
          {filteredQuestions.map(q => {
            const createdAtDate = typeof q.createdAt === 'string' ? new Date(q.createdAt) : q.createdAt;
            const userAnswers = answers[q.id] || [];
            return (
              <li key={q.id} className="animate-fade-in">
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
      {/* Animations */}
      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 0.4s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
} 