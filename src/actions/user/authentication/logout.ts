'use server'

import auth from '@/auth/auth'
import { cookies } from 'next/headers'

export default async function Logout() {
    try {
        cookies().delete('session_id')
        await auth.deleteCurrentUsersSession()
        return { success: 'Successfully logged out' }
    } catch (error) {
        return { error: 'Something went wrong' }
    }
}
