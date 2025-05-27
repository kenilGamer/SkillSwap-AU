import auth from '@/auth/auth'
import Post from '@/models/Post.model'

export default async function getMyPosts() {
    const res = await auth.getCurrentUser()
    if (res.error || !res.user) return { error: 'Something went wrong' }
    try {
        const posts = await Post.find({ owner: res.user._id }).limit(10).populate('owner', 'username image name _id')
        return { posts: JSON.parse(JSON.stringify(posts)).reverse() }
    } catch (error) {
        console.log(error)
        return { error: 'Something went wrong' }
    }
}
