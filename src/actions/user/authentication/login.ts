'use server'

import auth from '@/auth/auth'
import dbconnect from '@/helpers/dbconnect'
import User from '@/models/user.model'
import { userLoginValidation } from '@/validations/user.validation'
import argon from 'argon2'

import { z } from 'zod'

export default async function Login(values: z.infer<typeof userLoginValidation>) {
    const db = await dbconnect()
    if (db.error) return { error: 'Something went wrong' }

    const validate = userLoginValidation.safeParse(values)
    if (!validate.success) return { error: 'Invalid request' }
    try {
        const user = await User.findOne({ email: validate.data.email })
        if (!user) return { error: 'Incorrect email or password' }
        if (!user.password) return { error: 'Invalid user account' }
        if (!validate.data.password) return { error: 'Password is required' }
        const doesPassMatch = await argon.verify(user.password as string, validate.data.password)
        if (!doesPassMatch) return { error: 'Incorrect email or password' }
        const res = await auth.createSession({ userId: user._id.toString(), expiresIn: 1000 * 60 * 60 * 24 * 30 })
        if (res.error) return { error: res.error }
        return { success: 'Successfully logged in' }
    } catch (error) {
        return { error: 'Something went wrong' }
    }
}
