'use client'

import { Badge } from '@/components/shadcn/ui/badge'
import React, { useState, useEffect } from 'react'
import EditProfile from './EditProfile'
import { useSnapshot } from 'valtio'
import userStore from '@/store/user.store'
import { IPost } from '@/models/Post.model'
import RequirementCard, { IPropRequirementCard } from '@/components/root/RequirementCard'

export default function Profile({ posts }: { posts: IPost[] }) {
    const { user } = useSnapshot(userStore) as typeof userStore
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null // or a loading skeleton
    }

    return (
        <div className="flex w-full flex-col gap-5 overflow-auto bg-accent p-5">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-black/80">Your Profile</h1>
                <EditProfile user={user} />
            </div>
            <div className="flex flex-col gap-5 rounded-xl border bg-white p-5 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="h-fit shrink-0 flex items-center justify-center overflow-hidden rounded-xl bg-red-200">
                        {user?.image ? (
                            <img
                                className="h-32 w-32 object-cover"
                                src={user?.image || '/avatar/default.png'}
                                alt="Profile photo"
                            />
                        ) : (
                            <div className="flex h-32 w-32 items-center justify-center bg-blue-300 text-3xl">
                                {mounted && user?.name ? user.name.charAt(0).toUpperCase() : ''}
                            </div>
                        )}
                    </div>
                    <div className="flex w-full flex-col gap-4">
                        <div>
                            <h2 className="text-xl font-medium text-black/90">{user.name}</h2>
                        </div>
                        <hr />
                        <div className="flex gap-20">
                            <div className="flex flex-col gap-1 text-sm text-black/80">
                                <span>Username</span>
                                <span>Country</span>
                                <span>Email</span>
                                <span>Website</span>
                            </div>
                            <div className="flex flex-col gap-1 text-sm text-black/90">
                                <span>{user.username || 'unset'}</span>
                                <span>{user.country || 'unset'}</span>
                                <span>{user.email || 'unset'}</span>
                                {user.website ? (
                                    <a
                                        target="_blank"
                                        className="text-blue-600"
                                        href={user.website}
                                    >
                                        {user.website}
                                    </a>
                                ) : (
                                    <span>unset</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="flex flex-col gap-2">
                    <h2 className="text-lg font-medium text-black/80">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                        {!user.skills?.length && <span className="text-sm text-black/70">{"You haven't added any skills yet"}</span>}
                        {user?.skills?.map((name, i) => (
                            <Badge
                                className="rounded-full bg-indigo-500 hover:bg-indigo-500"
                                key={i}
                            >
                                {name}
                            </Badge>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-lg font-medium text-black/80">Bio</h2>
                    <p className="text-sm text-black/70">{user.bio || <span className="text-sm text-black/70">{"You haven't added your bio"}</span>}</p>
                </div>
            </div>
            {posts.length !== 0 && (
                <div>
                    <h2 className="mb-2 text-xl font-bold text-black/80">Posts</h2>
                    <div className="flex flex-col gap-5">
                        {posts.map((data, i) => (
                            <RequirementCard
                                key={i}
                                data={data as IPropRequirementCard}
                                myPost
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
