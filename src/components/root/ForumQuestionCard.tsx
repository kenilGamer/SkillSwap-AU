import React, { useState } from 'react';

interface ForumQuestionCardProps {
  title: string;
  description: string;
  userName?: string;
  userAvatarUrl?: string;
  createdAt?: string;
  isNew?: boolean;
  answers?: { userName: string; text: string }[];
  onAddAnswer?: (text: string) => void;
  children?: React.ReactNode;
}

export default function ForumQuestionCard({ title, description, userName = 'Anonymous', userAvatarUrl, createdAt, isNew, answers, onAddAnswer, children }: ForumQuestionCardProps) {
  const [reply, setReply] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;
    setSubmitting(true);
    if (onAddAnswer) {
      await onAddAnswer(reply);
    }
    setReply('');
    setSubmitting(false);
  };

  return (
    <div className="bg-gradient-to-tr from-blue-50 to-white rounded-xl shadow-lg p-5 mb-4 border border-blue-100 hover:shadow-xl transition-all">
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center overflow-hidden mr-3">
          {userAvatarUrl ? (
            <img src={userAvatarUrl} alt={userName} className="w-full h-full object-cover" />
          ) : (
            <span className="text-lg font-bold text-blue-700">{userName.charAt(0)}</span>
          )}
        </div>
        <div className="flex-1">
          <span className="font-semibold text-gray-800">{userName}</span>
          {createdAt && (
            <span className="ml-2 text-xs text-gray-400">{createdAt}</span>
          )}
        </div>
        {isNew && <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">New</span>}
      </div>
      <h3 className="text-lg font-bold text-blue-700 mb-1">{title}</h3>
      <p className="text-gray-700 mb-2 whitespace-pre-line">{description}</p>
      <div className="pt-2 border-t mt-2">
        {answers && answers.length > 0 && (
          <div className="mt-2">
            <h4 className="font-semibold text-gray-700 mb-2">Answers</h4>
            <ul className="space-y-2">
              {answers.map((a, i) => (
                <li key={i} className="bg-white rounded p-2 border border-gray-100">
                  <span className="font-medium text-blue-700">{a.userName}:</span> <span>{a.text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Reply form */}
        {onAddAnswer && (
          <form onSubmit={handleReply} className="flex gap-2 mt-4">
            <input
              type="text"
              className="flex-1 border rounded px-3 py-2 text-sm"
              placeholder="Write a reply..."
              value={reply}
              onChange={e => setReply(e.target.value)}
              disabled={submitting}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm"
              disabled={submitting || !reply.trim()}
            >
              {submitting ? 'Posting...' : 'Reply'}
            </button>
          </form>
        )}
        {children}
      </div>
    </div>
  );
} 