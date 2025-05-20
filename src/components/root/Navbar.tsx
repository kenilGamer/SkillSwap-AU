'use client'

import { MdOutlineLogout } from 'react-icons/md'
import { GoHome } from 'react-icons/go'
import { LiaHandshake } from 'react-icons/lia'
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5'
import { FaRegUser } from 'react-icons/fa'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import Logout from '@/actions/user/authentication/logout'
import { MdForum } from "react-icons/md";
import { GrCode } from "react-icons/gr";
import { CgUserlane } from "react-icons/cg";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/shadcn/ui/tooltip'
import React from 'react'
import * as RadixTooltip from '@radix-ui/react-tooltip'

export default function Navbar() {
    const pathname = usePathname()
    const links = [
        { path: '/', name: 'Home', icon: <GoHome /> },
        { path: '/matchmaking', name: 'Matchmaking', icon: <LiaHandshake /> },
        { path: '/chat', name: 'Chat', icon: <IoChatbubbleEllipsesOutline /> },
        { path: '/profile', name: 'Profile', icon: <FaRegUser /> },
        { path: '/forum', name: 'Forum', icon: <MdForum /> },
        { path: '/resources', name: 'Resources', icon: <GrCode /> },
        { path: '/mentorship', name: 'Mentorship', icon: <CgUserlane /> },
    ]
    const userAvatar = '/avatar/user1.png'; // Placeholder, replace with user image if available

    return (
        <TooltipProvider>
        <nav aria-label="Main navigation" className="relative flex h-screen w-16 flex-shrink-0 flex-col items-center justify-between bg-gradient-to-b from-indigo-50 to-indigo-100 p-3 shadow-lg">
            <div className="relative aspect-square w-12 mb-2">
                <Image
                    src="/logo.png"
                    alt="SkillSwap"
                    fill
                    className="rounded-xl shadow"
                />
            </div>
            <div className="flex flex-col items-center justify-center gap-6 flex-1">
                {links.map((e, i) => (
                    <Tooltip key={i} delayDuration={100}>
                        <TooltipTrigger asChild>
                            <Link
                                href={e.path}
                                aria-label={e.name}
                                className={`flex aspect-square w-10 items-center justify-center rounded-lg text-2xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 ${pathname === e.path ? 'bg-indigo-500 text-white shadow-lg scale-110' : 'text-indigo-600 hover:bg-indigo-200 hover:text-indigo-900'}`}
                            >
                                {e.icon}
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="text-sm font-medium">
                            {e.name}
                        </TooltipContent>
                    </Tooltip>
                ))}
            </div>
            <div className="flex flex-col items-center gap-4 mb-2">
                {/* User avatar (placeholder) */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link href="/profile" aria-label="Profile">
                            <Image src={userAvatar} alt="User Avatar" width={36} height={36} className="rounded-full border-2 border-indigo-300 shadow-sm hover:scale-105 transition-transform" />
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">Profile</TooltipContent>
                </Tooltip>
                {/* Logout button */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            onClick={async () => {
                                await Logout();
                                window.location.href = '/login';
                            }}
                            aria-label="Logout"
                            className="flex items-center justify-center rounded-full p-2 bg-red-100 text-red-500 hover:bg-red-200 hover:text-red-700 shadow transition-all focus:outline-none focus:ring-2 focus:ring-red-400"
                        >
                            <MdOutlineLogout size="26px" className="rotate-180" />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="right">Logout</TooltipContent>
                </Tooltip>
            </div>
        </nav>
        </TooltipProvider>
    )
}
