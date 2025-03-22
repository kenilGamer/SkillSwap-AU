'use client'

import { Badge } from '@/components/shadcn/ui/badge'
import React, { useState } from 'react'
import axios from 'axios'
import { IUser } from '@/models/user.model'
import { useEffect } from 'react'

export default function Profile({ user, currentUserId }: { user: IUser; currentUserId: string }) {
    const [isFollowing, setIsFollowing] = useState(user?.followers?.includes(currentUserId) ?? false)
    const [followers, setFollowers] = useState(user?.followers?.length?? 0);
    console.log(currentUserId);
    
    useEffect(() => {
        const fetchFollowers = async () => {
            try {
                const response = await axios.get(`/api/follow/${currentUserId}`);
                console.log("Followers API Response:", response.data);
                setFollowers(response.data.followers);
            } catch (error) {
                console.error("Error fetching followers:", error);
            }
        };
    
        if (user?._id) fetchFollowers();
    }, [user?._id]);
    
const handleFollow = async () => {
    try {
        const response = await axios.post(`/api/follow/${user._id}`, { currentUserId });

        console.log('Follow/Unfollow Response:', response.data);

        // Toggle following state
        setIsFollowing((prev) => !prev);
    } catch (error) {
        console.error('Error following user:', error);
    }
};

    return (
        <div className="flex w-full flex-col gap-5 overflow-hidden bg-accent p-5">
            <div className="flex flex-col gap-5 rounded-xl border bg-white p-5 shadow-sm">
                <div className="flex gap-4">
                    <div className="aspect-square h-full shrink-0 overflow-hidden rounded-xl bg-red-200">
                        {user.image ? (
                            <img
                                className="h-full w-full object-cover"
                                src={user.image}
                                alt="Profile Image"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-blue-300 text-3xl">
                                {user?.name?.charAt(0)}
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
                                    <a target="_blank" className="text-blue-600" href={user.website}>
                                        {user.website}
                                    </a>
                                ) : (
                                    <span>unset</span>
                                )}
                            </div>
                        </div>
                        <div>
                            <button
                                onClick={handleFollow}
                                className={`py-2 px-4 rounded text-white font-bold ${
                                    isFollowing ? 'bg-red-500 hover:bg-red-700' : 'bg-blue-500 hover:bg-blue-700'
                                }`}
                            >
                                {isFollowing ? 'Unfollow' : 'Follow'}
                            </button>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="flex flex-col gap-2">
                    <h2 className="text-lg font-medium text-black/80">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                        {!user.skills?.length && <span className="text-sm text-black/70">{user.name} has no skills</span>}
                        {user?.skills?.map((name, i) => (
                            <Badge className="rounded-full bg-indigo-500 hover:bg-indigo-500" key={i}>
                                {name}
                            </Badge>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-lg font-medium text-black/80">Bio</h2>
                    <p className="text-sm text-black/70">
                        {user.bio || <span className="text-sm text-black/70">{"He hasn't added any bio"}</span>}
                    </p>
                </div>
            </div>
        </div>
    )
}
