import auth from '@/auth/auth'
import Post from '@/models/Post.model'
import { IUserClient } from '@/models/user.model'

export default async function getMyPosts() {
    const res = await auth.getCurrentUser()
    if (res.error || !res.user) return { error: 'Something went wrong' }
    try {
        const posts = await Post.find({ owner: res.user._id })
            .limit(10)
            .populate<{ owner: IUserClient }>('owner', 'username image name _id followers following')
            .lean()

        // Transform and serialize the data
        const transformedPosts = posts.map(post => ({
            _id: post._id.toString(),
            requiredSkills: post.requiredSkills,
            description: post.description,
            githubLink: post.githubLink,
            category: post.category,
            star: post.star,
            createdAt: new Date(post.createdAt).toISOString(),
            updatedAt: new Date(post.updatedAt).toISOString(),
            owner: {
                _id: post.owner._id.toString(),
                username: post.owner.username,
                image: post.owner.image,
                name: post.owner.name,
                followerCount: Array.isArray(post.owner?.followers) ? post.owner.followers.length : 0,
                followingCount: Array.isArray(post.owner?.following) ? post.owner.following.length : 0
            }
        })).reverse()

        return { posts: transformedPosts }
    } catch (error) {
        console.log(error)
        return { error: 'Something went wrong' }
    }
}
