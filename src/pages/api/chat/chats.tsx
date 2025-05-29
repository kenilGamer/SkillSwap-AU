// pages/api/chat/create.ts
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/helpers/dbconnect'; // Connects to your database
import Chat from '@/models/Chat.model'; // Your Chat model

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { senderId, recipientId } = req.body;
  if (!senderId || !recipientId) {
    return res.status(400).json({ error: 'Missing participant IDs' });
  }

  try {
    // Check if a chat between these participants already exists
    let chat = await Chat.findOne({ participants: { $all: [senderId, recipientId] } });
    if (!chat) {
      // Create a new chat conversation if none exists
      chat = await Chat.create({
        participants: [senderId, recipientId],
        messages: [],
      });
    }

    return res.status(200).json({ data: chat });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
