'use server'

import auth from '@/auth/auth'
import formatUser from '@/helpers/formatUser'
import { IUser } from '@/models/user.model'

export default async function getUser() {
    const res = await auth.getCurrentUser()
    if (res.error) return { error: 'Something went wrong' }
    return { user: formatUser(res.user as Partial<IUser>) }
}
