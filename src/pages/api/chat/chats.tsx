import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/helpers/dbconnect';
import Chat from '@/models/Chat.model';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const chats = await Chat.find()
        .populate('sender receiver', 'username name')  // Populates sender and receiver fields, returning only username and name
        .sort({ createdAt: -1 });  // Optionally, sort by newest first

      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.status(200).json({ success: true, data: chats });
    } catch (error) {
      console.error('API Error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
