'use server'

import auth from '@/auth/auth'
import formatUser from '@/helpers/formatUser'
import User from '@/models/user.model'
import { userValidation } from '@/validations/user.validation'
import { z } from 'zod'

export default async function updateProfile(data: z.infer<typeof userValidation>) {
    const res = await auth.getCurrentUser()
    if (res.error) return { error: 'Something went wrong' }

    try {
        const user = await User.findByIdAndUpdate(res.user._id, data, {
            new: true,
        })
        return { success: 'Your profile has been updated', user: formatUser(user as any) }
    } catch (error: any) {
        if (error.code === 11000) {
            if (error.keyValue?.username) return { error: 'Username already in use' }
            return { error: 'Email already in use' }
        }
        return { error: 'Something went wrong' }
    }
}
