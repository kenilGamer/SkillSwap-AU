import getMyPosts from '@/actions/data/getMyPosts'
import Profile from './Profile'

export default async function page() {
    const { posts } = await getMyPosts()
    return <Profile posts={posts || []} />
}
