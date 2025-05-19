import { NextRequest, NextResponse } from 'next/server';

// In-memory mock data for demonstration
let questions = [
  {
    id: 1,
    title: 'React state management ka best tareeqa kya hai?',
    description: 'Mujhe apne React app ke liye state management ka best approach chahiye. Redux, Context API ya kuch aur?',
    userName: 'Ali Khan',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    title: 'Next.js me dynamic routing kaise kaam karta hai?',
    description: 'Dynamic routes banane ka sahi tareeqa kya hai Next.js me?',
    userName: 'Sara Ahmed',
    createdAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
  },
];

export async function GET() {
  return NextResponse.json(questions);
}

export async function POST(req: NextRequest) {
  const { title, description, userName } = await req.json();
  const newQuestion = {
    id: Date.now(),
    title,
    description,
    userName: userName || 'Anonymous',
    createdAt: new Date().toISOString(),
  };
  questions = [newQuestion, ...questions];
  return NextResponse.json({ success: true, question: newQuestion });
} 