import type { NextApiRequest, NextApiResponse } from 'next'
// Import your Chat model here
import Chat from '@/models/Chat.model'
import Message from '@/models/Message.model'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  const { id } = req.query

  if (req.method === 'DELETE') {
    try {
      // TODO: Replace with your actual DB/model logic
      // const deleted = await Chat.findByIdAndDelete(id);
      // if (!deleted) return res.status(404).json({ error: 'Chat not found' });
      // return res.status(200).json({ success: true });

      // Dummy response for now:
      if (id) {
        return res.status(200).json({ success: true });
      }
      return res.status(404).json({ error: 'Chat not found' });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to delete chat' });
    }
  }

  if (req.method === 'GET') {
    try {
      // Find the chat and return its messages
      const chat = await Chat.findById(id).lean();
      if (!chat) return res.status(404).json({ error: 'Chat not found' });
      const messages = await Message.find({ chat: id }).sort({ createdAt: 1 });
      return res.status(200).json({ messages });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to fetch messages' });
    }
  }

  // TODO: Replace with your actual DB/model logic
  // Example:
  // const chat = await Chat.findById(id).populate('messages');
  // if (!chat) return res.status(404).json({ error: 'Chat not found' });
  // return res.status(200).json({ messages: chat.messages });

  // For now, just return a dummy response:
  if (id === 'dummy') {
    return res.status(200).json({ messages: [{ sender: 'test', content: 'Hello!' }] });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
