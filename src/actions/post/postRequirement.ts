'use server'

import auth from '@/auth/auth'
import Post from '@/models/Post.model'
import { postValidation } from '@/validations/post.validation'
import { z } from 'zod'

export default async function postRequirement(data: z.infer<typeof postValidation>) {
  // Get the current user
  const res = await auth.getCurrentUser()
  if (res.error) return { error: 'Something went wrong' }
  
  // Validate incoming data using Zod
  const value = postValidation.safeParse(data)
  if (!value.success) return { error: 'Invalid data' }

  try {
    // Create the post with all validated fields and add the owner's ID
    await Post.create({ ...value.data, owner: (res.user as any)._id })
    return { success: 'Requirement has been posted' }
  } catch (error) {
    return { message: 'Something went wrong', error: error }
  }
}
