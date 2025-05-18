import type { NextApiRequest, NextApiResponse } from 'next'
import User from '@/models/user.model'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  if (req.method === 'GET') {
    const user = await User.findById(id).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ user });
  }
  return res.status(405).json({ error: 'Method not allowed' });
} 