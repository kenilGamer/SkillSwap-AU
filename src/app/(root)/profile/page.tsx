import getMyPosts from '@/actions/data/getMyPosts'
import Profile from './Profile'
import type { IUser } from '@/models/user.model'

export default async function page() {
    const { posts } = await getMyPosts()
    const mappedPosts = (posts || []).map(post => ({
        ...post,
        owner: {
            _id: post.owner._id,
            username: post.owner.username,
            image: post.owner.image,
            name: post.owner.name,
            followerCount: post.owner.followerCount,
            followingCount: post.owner.followingCount,
            role: "user",
            email: "",
            skills: [],
            bio: "",
            country: "",
            website: "",
            verified: false,
            followers: [],
            following: [],
        } as unknown as IUser,
        createdAt: new Date(post.createdAt),
        updatedAt: new Date(post.updatedAt),
    }))
    return <Profile posts={mappedPosts} />
}
