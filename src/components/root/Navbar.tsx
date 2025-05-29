'use client'

import { MdOutlineLogout } from 'react-icons/md'
import { GoHome } from 'react-icons/go'
import { LiaHandshake } from 'react-icons/lia'
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import Logout from '@/actions/user/authentication/logout'
import { MdForum } from "react-icons/md"
import { GrCode } from "react-icons/gr"
import { CgUserlane } from "react-icons/cg"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/shadcn/ui/tooltip'
import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search } from 'lucide-react'
import { useOnClickOutside } from '@/hooks/useOnClickOutside'
import { useDebounce } from '@/hooks/useDebounce'
import { Command } from 'cmdk'
import { Badge } from '@/components/shadcn/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/ui/avatar'
import { Skeleton } from '@/components/shadcn/ui/skeleton'

interface SearchResult {
    type: 'user' | 'post'
    id: string
    name?: string
    username?: string
    image?: string
    skills: string[]
    bio?: string
    description?: string
    requiredSkills: string[]
    category?: string
    owner?: {
        name: string
        username: string
        image: string
    }
}

export default function Navbar() {
    const pathname = usePathname()
    const router = useRouter()
    const [showSearch, setShowSearch] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [results, setResults] = useState<{ users: SearchResult[], posts: SearchResult[] }>({ users: [], posts: [] })
    const [isLoading, setIsLoading] = useState(false)
    const searchRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const debouncedQuery = useDebounce(searchQuery, 300)
    const userAvatar = '/avatar/user1.png' // Placeholder, replace with user image if available

    const links = [
        { path: '/', name: 'Home', icon: <GoHome /> },
        { path: '/matchmaking', name: 'Matchmaking', icon: <LiaHandshake /> },
        { path: '/chat', name: 'Chat', icon: <IoChatbubbleEllipsesOutline /> },
        { path: '/forum', name: 'Forum', icon: <MdForum /> },
        { path: '/resources', name: 'Resources', icon: <GrCode /> },
        { path: '/mentorship', name: 'Mentorship', icon: <CgUserlane /> },
    ]

    // Fetch search results
    useEffect(() => {
        const fetchResults = async () => {
            if (!debouncedQuery) {
                setResults({ users: [], posts: [] })
                return
            }

            setIsLoading(true)
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
                const data = await res.json()
                setResults(data.results)
            } catch (error) {
                console.error('Search error:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchResults()
    }, [debouncedQuery])

    // Close search when clicking outside
    useOnClickOutside<HTMLDivElement>(searchRef, () => setShowSearch(false))

    // Focus input when search is shown
    useEffect(() => {
        if (showSearch) {
            inputRef.current?.focus()
        }
    }, [showSearch])

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setShowSearch(false)
        }
        window.addEventListener('keydown', handleEscape)
        return () => window.removeEventListener('keydown', handleEscape)
    }, [])

    const handleResultClick = (result: SearchResult) => {
        setShowSearch(false)
        setSearchQuery('')
        if (result.type === 'user') {
            router.push(`/profile/${result.id}`)
        } else {
            router.push(`/post/${result.id}`)
        }
    }

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
                            <motion.div 
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <button
                                    onClick={() => setShowSearch(!showSearch)}
                                    className={`relative flex aspect-square w-10 items-center justify-center rounded-lg text-2xl transition-all duration-200 ${
                                        showSearch 
                                            ? 'bg-indigo-500 text-white' 
                                            : 'text-indigo-600 hover:bg-indigo-100 hover:text-indigo-900'
                                    } focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2`}
                                >
                                    <Search className="h-5 w-5" />
                                </button>
                            </motion.div>
                        </TooltipTrigger>
                        <TooltipContent side="right">Search</TooltipContent>
                    </Tooltip>

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

                <AnimatePresence>
                    {showSearch && (
                        <motion.div
                            ref={searchRef}
                            initial={{ opacity: 0, x: -20, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -20, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="absolute left-16 top-4 w-96"
                        >
                            <Command className="relative rounded-lg border bg-white shadow-lg">
                                <div className="flex items-center border-b px-3">
                                    <Search className="h-4 w-4 text-gray-400" />
                                    <input
                                        ref={inputRef}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="flex-1 bg-transparent py-3 px-2 text-sm outline-none placeholder:text-gray-400"
                                        placeholder="Search users, skills, or posts..."
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-[400px] overflow-y-auto p-2">
                                    {isLoading ? (
                                        <div className="space-y-2">
                                            {[...Array(3)].map((_, i) => (
                                                <div key={i} className="flex items-center gap-3 p-2">
                                                    <Skeleton className="h-10 w-10 rounded-full" />
                                                    <div className="space-y-2">
                                                        <Skeleton className="h-4 w-32" />
                                                        <Skeleton className="h-3 w-24" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : searchQuery ? (
                                        <>
                                            {results.users.length > 0 && (
                                                <div className="mb-4">
                                                    <h3 className="mb-2 px-2 text-xs font-semibold text-gray-500">Users</h3>
                                                    <div className="space-y-1">
                                                        {results.users.map((user) => (
                                                            <button
                                                                key={user.id}
                                                                onClick={() => handleResultClick(user)}
                                                                className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-gray-50"
                                                            >
                                                                <Avatar className="h-10 w-10">
                                                                    <AvatarImage src={user.image} />
                                                                    <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                                                                </Avatar>
                                                                <div className="flex-1 overflow-hidden">
                                                                    <div className="font-medium text-gray-900">{user.name}</div>
                                                                    <div className="text-sm text-gray-500">@{user.username}</div>
                                                                    {user.skills && user.skills.length > 0 && (
                                                                        <div className="mt-1 flex flex-wrap gap-1">
                                                                            {user.skills.slice(0, 2).map((skill, i) => (
                                                                                <Badge key={i} variant="secondary" className="text-xs">
                                                                                    {skill}
                                                                                </Badge>
                                                                            ))}
                                                                            {user.skills.length > 2 && (
                                                                                <span className="text-xs text-gray-500">+{user.skills.length - 2}</span>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {results.posts.length > 0 && (
                                                <div>
                                                    <h3 className="mb-2 px-2 text-xs font-semibold text-gray-500">Posts</h3>
                                                    <div className="space-y-1">
                                                        {results.posts.map((post) => (
                                                            <button
                                                                key={post.id}
                                                                onClick={() => handleResultClick(post)}
                                                                className="flex w-full items-start gap-3 rounded-lg p-2 text-left hover:bg-gray-50"
                                                            >
                                                                <Avatar className="h-8 w-8">
                                                                    <AvatarImage src={post.owner?.image} />
                                                                    <AvatarFallback>{post.owner?.name?.[0]}</AvatarFallback>
                                                                </Avatar>
                                                                <div className="flex-1 overflow-hidden">
                                                                    <div className="text-sm text-gray-900 line-clamp-2">{post.description}</div>
                                                                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                                                                        <span>{post.owner?.name}</span>
                                                                        <span>•</span>
                                                                        <span>{post.category}</span>
                                                                    </div>
                                                                    {post.requiredSkills && post.requiredSkills.length > 0 && (
                                                                        <div className="mt-1 flex flex-wrap gap-1">
                                                                            {post.requiredSkills.slice(0, 2).map((skill, i) => (
                                                                                <Badge key={i} variant="secondary" className="text-xs">
                                                                                    {skill}
                                                                                </Badge>
                                                                            ))}
                                                                            {post.requiredSkills.length > 2 && (
                                                                                <span className="text-xs text-gray-500">+{post.requiredSkills.length - 2}</span>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {!isLoading && results.users.length === 0 && results.posts.length === 0 && (
                                                <div className="py-6 text-center text-sm text-gray-500">
                                                    No results found for &quot;{searchQuery}&quot;
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="py-6 text-center text-sm text-gray-500">
                                            Type to search users, skills, or posts...
                                        </div>
                                    )}
                                </div>
                            </Command>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </TooltipProvider>
    )
}
