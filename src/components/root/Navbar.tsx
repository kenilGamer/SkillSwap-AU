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
import { motion } from 'framer-motion'

export default function Navbar() {
    const pathname = usePathname()
    const links = [
        { path: '/', name: 'Home', icon: <GoHome /> },
        { path: '/matchmaking', name: 'Matchmaking', icon: <LiaHandshake /> },
        { path: '/chat', name: 'Chat', icon: <IoChatbubbleEllipsesOutline /> },
        { path: '/forum', name: 'Forum', icon: <MdForum /> },
        { path: '/resources', name: 'Resources', icon: <GrCode /> },
        { path: '/mentorship', name: 'Mentorship', icon: <CgUserlane /> },
    ]
    const userAvatar = '/avatar/user1.png'; // Placeholder, replace with user image if available

    return (
        <TooltipProvider>
        <nav aria-label="Main navigation" className="relative flex h-screen w-16 flex-shrink-0 flex-col items-center justify-between bg-gradient-to-b from-indigo-50 to-indigo-100 p-3 shadow-lg">
            <Link href="/" className="relative aspect-square w-12 mb-2 group" aria-label="Home">
                <motion.div whileHover={{ scale: 1, boxShadow: '0 4px 6px #6366f1' }} transition={{ type: 'spring', stiffness: 300 }}>
                    <Image
                        src="/logo.png"
                        alt="SkillSwap"
                        fill
                        sizes="(max-width: 768px) 120px, 200px"
                        className="rounded-xl"
                    />
                </motion.div>
            </Link>
            <div className="flex flex-col items-center justify-center gap-6 flex-1">
                {links.map((e, i) => (
                    <Tooltip key={i} delayDuration={100}>
                        <TooltipTrigger asChild>
                            <motion.div whileTap={{ scale: 0.92 }}>
                                <Link
                                    href={e.path}
                                    aria-label={e.name}
                                    className={`flex aspect-square w-10 items-center justify-center rounded-lg text-2xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 ${pathname === e.path ? 'bg-indigo-500 text-white shadow-lg scale-110 border-2 border-indigo-700' : 'text-indigo-600 hover:bg-indigo-200 hover:text-indigo-900'}`}
                                >
                                    {e.icon}
                                </Link>
                            </motion.div>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="text-sm font-medium">
                            {e.name}
                        </TooltipContent>
                    </Tooltip>
                ))}
            </div>
            <div className="flex flex-col items-center gap-4 mb-2">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <motion.div whileHover={{ scale: 1.08 }}>
                            <Link href="/profile" aria-label="Profile">
                                <Image src={userAvatar} alt="User Avatar" width={36} height={36} className="rounded-full border-2 border-indigo-300 shadow-sm hover:scale-105 transition-transform" />
                            </Link>
                        </motion.div>
                    </TooltipTrigger>
                    <TooltipContent side="right">Profile</TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <motion.button
                            whileTap={{ scale: 0.92 }}
                            onClick={async () => {
                                if (window.confirm('Are you sure you want to logout?')) {
                                    await Logout();
                                    window.location.href = '/login';
                                }
                            }}
                            aria-label="Logout"
                            className="flex items-center justify-center rounded-full p-2 bg-red-100 text-red-500 hover:bg-red-200 hover:text-red-700 shadow transition-all focus:outline-none focus:ring-2 focus:ring-red-400"
                        >
                            <MdOutlineLogout size="26px" className="rotate-180" />
                        </motion.button>
                    </TooltipTrigger>
                    <TooltipContent side="right">Logout</TooltipContent>
                </Tooltip>
            </div>
        </nav>
        </TooltipProvider>
    )
}
