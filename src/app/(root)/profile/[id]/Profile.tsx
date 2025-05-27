'use client'

import { Badge } from '@/components/shadcn/ui/badge'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { IUser } from '@/models/user.model'
import { FaUserEdit, FaUserTag, FaInfoCircle } from 'react-icons/fa'
import { FiCamera } from 'react-icons/fi'

export default function Profile({ user, currentUserId }: { user: IUser; currentUserId: string }) {
    const [isFollowing, setIsFollowing] = useState(user?.followers?.includes(currentUserId) ?? false)
    const [loading, setLoading] = useState(false)
    
    useEffect(() => {
        const fetchFollowers = async () => {
            try {
                await axios.get(`/api/follow/${currentUserId}`);
            } catch (error) {
                console.error("Error fetching followers:", error);
            }
        };
    
        if (user?._id) fetchFollowers();
    }, [user?._id]);
    
    const handleFollow = async () => {
        setLoading(true)
        try {
            await axios.post(`/api/follow/${user._id}`, { currentUserId });
            setIsFollowing((prev) => !prev);
        } catch (error) {
            console.error('Error following user:', error);
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="flex w-full flex-col items-center bg-gradient-to-b from-indigo-50 to-white min-h-screen py-8 px-2">
            {/* Banner/Cover */}
            <div className="w-full max-w-2xl h-32 rounded-2xl bg-gradient-to-r from-indigo-400 to-indigo-600 mb-[-67px] shadow-lg relative flex items-end justify-center   ">
                <div className="absolute inset-0 bg-black/10 pointer-events-none" />
                {/* Avatar */}
                <div className="absolute left-1/2 -bottom-16 -translate-x-1/2 group">
                    <div className="h-32 w-32 rounded-full border-4 border-white shadow-xl bg-gray-200 overflow-hidden flex items-center justify-center relative group-hover:shadow-2xl transition-all duration-200">
                        {user.image ? (
                            <img
                                className="h-full w-full object-cover"
                                src={user.image}
                                alt="Profile Image"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-blue-300 text-4xl font-bold text-white">
                                {user?.name?.charAt(0)}
                            </div>
                        )}
                        <span className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow group-hover:opacity-100 opacity-0 transition-opacity duration-200">
                            <FiCamera className="text-indigo-500" />
                        </span>
                    </div>
                </div>
            </div>
            {/* Card */}
            <div className="w-full max-w-2xl mt-20 rounded-2xl bg-white border border-slate-100 shadow-xl p-8 flex flex-col gap-8">
                <div className="flex flex-col md:flex-row md:items-center md:gap-8 gap-4 items-center">
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-3xl font-extrabold text-indigo-700 mb-1 flex items-center gap-2">
                            <FaUserTag className="text-indigo-400" /> {user.name}
                        </h2>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 justify-center md:justify-start mb-2">
                            {user.username && user.username !== 'unset' && <span>@{user.username}</span>}
                            {user.country && user.country !== 'unset' && <span>{user.country}</span>}
                            {user.email && user.email !== 'unset' && <span>{user.email}</span>}
                            {user.website && user.website !== 'unset' ? (
                                <a target="_blank" className="text-blue-600 underline hover:text-blue-800 transition" href={user.website}>{user.website}</a>
                            ) : null}
                        </div>
                        <button
                            onClick={handleFollow}
                            className={`mt-2 py-2 px-6 rounded-full font-semibold shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 flex items-center gap-2 ${isFollowing ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-indigo-500 hover:bg-indigo-600 text-white'}`}
                            title={isFollowing ? 'Unfollow this user' : 'Follow this user'}
                            disabled={loading}
                        >
                            {loading ? (
                                <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                            ) : (
                                <FaUserEdit className="text-white" />
                            )}
                            {isFollowing ? 'Unfollow' : 'Follow'}
                        </button>
                    </div>
                </div>
                <hr className="my-2" />
                <div>
                    <h3 className="text-lg font-semibold text-indigo-700 mb-2 flex items-center gap-2">
                        <FaUserTag /> Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {!user.skills?.length && (
                            <span className="text-sm text-gray-400 flex items-center gap-1">
                                <FaInfoCircle /> No skills listed
                            </span>
                        )}
                        {user?.skills?.map((name, i) => (
                            <Badge className="rounded-full bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 text-sm font-medium shadow" key={i}>
                                {name}
                            </Badge>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-indigo-700 mb-2 flex items-center gap-2">
                        <FaInfoCircle /> Bio
                    </h3>
                    <p className="text-base text-gray-700 min-h-[40px]">
                        {user.bio || <span className="text-gray-400 flex items-center gap-1"><FaInfoCircle /> No bio provided.</span>}
                    </p>
                </div>
            </div>
        </div>
    )
}
