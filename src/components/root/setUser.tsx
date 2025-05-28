'use client'

import { IUser } from '@/models/user.model'
import userStore from '@/store/user.store'
import { useEffect } from 'react'

export default function SetUser({ user }: { user: IUser }) {
    useEffect(() => {
        userStore.user = user
    }, [user])
    
    return null
}
