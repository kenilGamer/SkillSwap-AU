'use server'

import auth from '@/auth/auth'
import Post from '@/models/Post.model'
import { postValidation } from '@/validations/post.validation'
import { z } from 'zod'

export default async function postRequirement(data: z.infer<typeof postValidation>) {
    const res = await auth.getCurrentUser()
    if (res.error) return { error: 'Something went wrong' }
    const value = postValidation.safeParse(data)
    
    if (!value.success) return { error: 'Invalid data' }
    try {
        await Post.create({ ...value.data, owner: res.user._id })
        return { success: 'Requirement has been posted' }
    } catch (error) {
        console.log(error)
        return { error: 'Something went wrong' }
    }
}
