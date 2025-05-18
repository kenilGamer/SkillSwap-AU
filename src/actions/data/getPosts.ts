import auth from '@/auth/auth'
import Post from '@/models/Post.model'

export default async function getPosts() {
    const res = await auth.getCurrentUser()
    if (res.error) return { error: 'Something went wrong' }
    try {
        const posts = await Post.find().limit(10).populate('owner', 'username image name _id')
        return { posts: JSON.parse(JSON.stringify(posts)).reverse() }
    } catch (error) {
        console.error(error)
        return { error: 'Something went wrong' }
    }
}
