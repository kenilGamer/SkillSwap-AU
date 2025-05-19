import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Answer from '@/models/answer.model';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'GET') {
    const { questionId } = req.query;
    if (!questionId) return res.status(400).json({ message: 'Missing questionId' });
    // Only return answers from the last 2 days
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    // Delete answers older than 2 days
    await Answer.deleteMany({ createdAt: { $lt: twoDaysAgo } });
    const answers = await Answer.find({
      questionId: Number(questionId),
      createdAt: { $gte: twoDaysAgo },
    }).sort({ createdAt: 1 });
    res.status(200).json(answers);
  } else if (req.method === 'POST') {
    const { questionId, userName, text, userAvatarUrl } = req.body;
    if (!questionId || !userName || !text) return res.status(400).json({ message: 'Missing fields' });
    const answer = await Answer.create({ questionId, userName, text, userAvatarUrl });
    res.status(201).json(answer);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
} 