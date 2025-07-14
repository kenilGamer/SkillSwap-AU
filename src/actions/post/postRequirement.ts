'use server'

import auth from '@/auth/auth'
import Post from '@/models/Post.model'
import { postValidation } from '@/validations/post.validation'
import { z } from 'zod'
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth/[...nextauth]/options";

interface User {
    _id?: string;
    id?: string;
}

export default async function postRequirement(data: z.infer<typeof postValidation>) {
  // Get the current user
  const res = await auth.getCurrentUser()
  console.log(res);
  
  if (res.error || !res.user || (!(res.user as User)._id && !(res.user as User).id)) return { error: 'User not found or not authenticated' }
  
  // Validate incoming data using Zod
  const value = postValidation.safeParse(data)
  if (!value.success) return { error: 'Invalid data' }

  try {
    // Create the post with all validated fields and add the owner's ID
    await Post.create({ ...value.data, owner: (res.user as User).id })
    return { success: 'Requirement has been posted' }
  } catch (error) {
    return { message: 'Something went wrong', error: error instanceof Error ? error.message : String(error) };
  }
}

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user || !session.user.id) {
    return { error: "User not found or not authenticated" };
  }
  return { user: session.user };
}
