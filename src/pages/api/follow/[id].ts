import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/helpers/dbConnect';
import User from '@/models/user.model';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();
    res.setHeader('Cache-Control', 'no-store, max-age=0');

    const { id } = req.query; // Extract user ID from URL

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ message: 'User ID is required' });
    }

    if (req.method === 'GET') {
        try {
            const user = await User.findById(id).select('followers');
            if (!user) return res.status(404).json({ message: 'User not found' });

            return res.status(200).json({ followers: user.followers || [] });
        } catch (error) {
            console.error('Error fetching followers:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    if (req.method === 'POST') {
        try {
            const { currentUserId } = req.body;
            if (!currentUserId) return res.status(400).json({ message: 'Current user ID is required' });

            // Fetch both users in parallel
            const [user, currentUser] = await Promise.all([
                User.findById(id),
                User.findById(currentUserId)
            ]);

            if (!user || !currentUser) return res.status(404).json({ message: 'User not found' });

            // Ensure `followers` and `following` fields are always arrays
            user.followers = Array.isArray(user.followers) ? user.followers : [];
            currentUser.following = Array.isArray(currentUser.following) ? currentUser.following : [];

            // Check if current user is already following
            const isFollowing = user.followers.map(String).includes(currentUserId);

            if (isFollowing) {
                // Unfollow user
                user.followers = user.followers.filter(uid => uid.toString() !== currentUserId);
                currentUser.following = currentUser.following.filter(uid => uid.toString() !== id);
            } else {
                // Follow user
                user.followers.push(currentUserId);
                currentUser.following.push(id);
            }

            await Promise.all([user.save(), currentUser.save()]);

            return res.status(200).json({ message: isFollowing ? 'Unfollowed' : 'Followed' });
        } catch (error) {
            console.error('Error following user:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
}
