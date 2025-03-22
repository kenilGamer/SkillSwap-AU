'use server'

import auth from '@/auth/auth'
import User from '@/models/user.model'

export default async function getMatchedUser(skills: string[]) {
    const res = await auth.getCurrentUser()
    if (res.error) return { error: 'Something went wrong' }
    try {
        const user = await User.findOne({ skills: { $in: skills } })
        return { user: JSON.parse(JSON.stringify(user)) }
    } catch (error) {
        console.log(error)
        return { error: 'Something went wrong' }
    }
}
