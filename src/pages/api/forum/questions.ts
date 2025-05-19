import type { NextApiRequest, NextApiResponse } from 'next';

let questions = [
  {
    id: 1,
    title: 'What is the best way to manage state in React?',
    description: 'I want to know the best approach for state management in my React app. Should I use Redux, Context API, or something else?',
    userName: 'Ali Khan',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    title: 'How does dynamic routing work in Next.js?',
    description: 'What is the correct way to create dynamic routes in Next.js?',
    userName: 'Sara Ahmed',
    createdAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json(questions);
  } else if (req.method === 'POST') {
    const { title, description, userName } = req.body;
    const newQuestion = {
      id: Date.now(),
      title,
      description,
      userName: userName || 'Anonymous',
      createdAt: new Date().toISOString(),
    };
    questions = [newQuestion, ...questions];
    res.status(200).json({ success: true, question: newQuestion });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
} 