'use client'

import { IUser } from '@/models/user.model'
import userStore from '@/store/user.store'

export default function SetUser({ user }: { user: IUser }) {
    userStore.user = user
    return <div></div>
}
