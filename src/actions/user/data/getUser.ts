'use server'

import auth from '@/auth/auth'
import formatUser from '@/helpers/formatUser'
import { IUser } from '@/models/user.model'

export default async function getUser() {
    const { error, user }: { user: IUser; error: string } = await auth.getCurrentUser()
    if (error) return { error: 'Something went wrong' }
    return { user: formatUser(user) }
}
