'use client'

import { IUserClient } from '@/models/user.model'
import userStore from '@/store/user.store'
import { useEffect } from 'react'

export default function SetUser({ user }: { user: IUserClient }) {
    useEffect(() => {
        userStore.user = user
    }, [user])
    
    return null
}
