'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import User  from '@/models/user.model'
import { UserFormData } from '@/lib/validations/user'
import { revalidatePath } from 'next/cache'
import dbconnect from '@/helpers/dbconnect'
export async function updateProfile(data: UserFormData) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return { success: false, error: 'Not authenticated' }
        }

        await dbconnect()

        // Check if username is taken by another user
        const existingUser = await User.findOne({
            username: data.username,
            email: { $ne: session.user.email }
        })

        if (existingUser) {
            return { success: false, error: 'Username is already taken' }
        }

        // Update user profile
        const updatedUser = await User.findOneAndUpdate(
            { email: session.user.email },
            { 
                $set: {
                    name: data.name,
                    username: data.username,
                    bio: data.bio || '',
                    country: data.country || '',
                    website: data.website || '',
                    skills: data.skills || []
                }
            },
            { new: true }
        )

        if (!updatedUser) {
            return { success: false, error: 'User not found' }
        }

        revalidatePath('/')
        return { success: true, user: updatedUser }
    } catch (error) {
        console.error('Error updating profile:', error)
        return { success: false, error: 'Failed to update profile' }
    }
}
