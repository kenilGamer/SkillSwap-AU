import auth from '@/auth/auth'
import Post from '@/models/Post.model'
import mongoose from 'mongoose'

export default async function getPosts() {
    const res = await auth.getCurrentUser()
    if (res.error) return { error: 'Something went wrong' }
    
    try {
        // Ensure MongoDB is connected
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(process.env.MONGODB_URI || '')
        }
        
        const posts = await Post.find()
            .limit(10)
            .populate('owner', 'username image name _id')
            .lean()
            .exec()
            
        return { posts: JSON.parse(JSON.stringify(posts)).reverse() }
    } catch (error) {
        console.error('Error fetching posts:', error)
        return { error: 'Failed to fetch posts. Please try again.' }
    }
}
