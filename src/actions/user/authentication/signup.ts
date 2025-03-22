'use server'

import argon from 'argon2'
import { z } from 'zod'
import auth from '@/auth/auth'
import { userSignupValidation } from '@/validations/user.validation'
import dbconnect from '@/helpers/dbconnect'
import User from '@/models/user.model'

export default async function Signup(values: z.infer<typeof userSignupValidation>) {
    const db = await dbconnect()
    if (db.error) return { error: 'Something went wrong' }

    const validate = userSignupValidation.safeParse(values)
    if (!validate.success) return { error: 'Invalid request' }
    try {
        const hash = await argon.hash(validate.data.password)
        const user = await User.create({ ...validate.data, password: hash })
        const res = await auth.createSession({ userId: user._id.toString(), expiresIn: 1000 * 60 * 60 * 24 * 30 })
        if (res.error) return { error: res.error }
        return { success: 'Account created successfully' }
    } catch (error: any) {
        if (error.code === 11000) {
            if (error.keyValue?.username) return { error: 'Username already in use' }
            return { error: 'Email already in use' }
        }
        return { error: 'Something went wrong' }
    }
}
