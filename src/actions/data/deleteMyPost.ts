'use server'

import auth from '@/auth/auth'
import Post from '@/models/Post.model'

export default async function deleteMyPost(id: string) {
    const res = await auth.getCurrentUser()
    if (res.error) return { error: 'Something went wrong' }
    try {
        await Post.findOneAndDelete({ owner: res.user._id, _id: id })
        return { success: "Successfully deleted this post" }
    } catch (error) {
        return { error: 'Something went wrong' }
    }
}
