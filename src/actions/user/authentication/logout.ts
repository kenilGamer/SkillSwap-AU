'use server'

import auth from '@/auth/auth'
import { cookies } from 'next/headers'

export default async function Logout() {
    try {
        const cookieStore = await cookies()
        cookieStore.delete('session_id')
        await auth.deleteCurrentUsersAllSessions()
        return { success: 'Successfully logged out from all devices' }
    } catch (error) {
        return { error: 'Something went wrong' }
    }
}
