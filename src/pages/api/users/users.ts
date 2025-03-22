import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/helpers/dbconnect';
import User from '@/models/user.model';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const user = await User.find()
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      console.error('API Error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  } else {
    console.log();
    
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
