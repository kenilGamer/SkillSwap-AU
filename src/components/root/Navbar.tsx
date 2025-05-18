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

export default function Navbar() {
    const pathname = usePathname()
    const links = [
        { path: '/', name: 'Home', icon: <GoHome /> },
        { path: '/matchmaking', name: 'Matchmaking', icon: <LiaHandshake /> },
        { path: '/chat', name: 'Chat', icon: <IoChatbubbleEllipsesOutline /> },
        { path: '/profile', name: 'Profile', icon: <FaRegUser /> },
        
    ]

    return (
        <div className="relative flex h-screen w-14 flex-shrink-0 flex-col items-center justify-between bg-accent p-2 shadow-[0px_1px_4px_#00000070]">
            <div className="relative aspect-square w-full">
                <Image
                    src="/logo.png"
                    alt="SkillSwap"
                    fill
                />
            </div>
            <div className="flex flex-col items-center justify-center gap-5">
                {links.map((e, i) => (
                    <Link
                        key={i}
                        href={e.path}
                        className={`flex aspect-square w-9 items-center justify-center rounded-md text-2xl ${pathname === e.path && 'bg-indigo-500 text-xl text-white'}`}
                    >
                        {e.icon}
                    </Link>
                ))}
            </div>
            <MdOutlineLogout
                onClick={async () => {
                    await Logout()
                    window.location.href = '/login'
                }}
                size="30px"
                className="rotate-180 cursor-pointer"
            />
        </div>
    )
}
