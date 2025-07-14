'use client'

import { Input } from '@/components/shadcn/ui/input'
import { useEffect, useState } from 'react'
import { FaRegBell } from 'react-icons/fa'
import { MdSearch } from 'react-icons/md'
import ChatCard from './ChatCard'
import ChatPanel from './ChatPanel'
import axios from 'axios'
import { useSearchParams } from 'next/navigation'

interface ChatData {
  _id: string;
  username: string;
  name?: string;
  message?: string;
  lastMessage?: { content: string };
}

export default function Chat() {
  const [showUnsavedChats, setShowUnsavedChats] = useState(false)
  const [chats, setChats] = useState<ChatData[]>([])
  const [filteredChats, setFilteredChats] = useState<ChatData[]>([])
  const [query, setQuery] = useState('')
  const searchParams = useSearchParams()
  const sender = searchParams?.get('sender')

  // Fetch chats on mount (and when sender changes)
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(`/api/users/users`, {
          params: { sender },
        })

        if (Array.isArray(response.data.data)) {
          setChats(response.data.data)
          setFilteredChats(response.data.data)
        } else {
          console.error('Unexpected data format:', response.data)
          setChats([])
          setFilteredChats([])
        }
      } catch (error) {
        console.error('Error fetching chats:', error)
        setChats([])
        setFilteredChats([])
      }
    }

    fetchChats()
  }, [sender])

  // Filter chats based on the query whenever query or chats change
  useEffect(() => {
    if (!query) {
      setFilteredChats(chats)
    } else {
      setFilteredChats(
        chats.filter((chat) => {
          // Adjust this logic based on your chat data structure.
          // For example, if chat has a 'name' or 'message' field:
          const searchField = `${chat.name || ''} ${chat.message || ''}`.toLowerCase()
          return searchField.includes(query.toLowerCase())
        })
      )
    }
  }, [query, chats])

  return (
    <div className="flex grow overflow-hidden h-screen w-full">
      {/* Left Sidebar: Chat List */}
      <div className="relative flex w-[330px] select-none flex-col py-3 shadow-[0px_0px_3px_#00000040]">
        {/* Search Bar */}
        <div className="relative mx-3">
          <MdSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-black/60" />
          <Input
            className="pl-8"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {/* Header with Title and Notification Icon */}
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-medium">
            {showUnsavedChats ? 'Unsaved Chats' : 'Messages'}
          </h1>
          <div
            onClick={() => setShowUnsavedChats(!showUnsavedChats)}
            className="relative cursor-pointer"
          >
            <div className="absolute bottom-[60%] right-[40%] z-10 aspect-square w-2 rounded-full bg-red-500"></div>
            <div className={`rounded-full p-[6px] ${showUnsavedChats && 'bg-gray-200'}`}>
              <FaRegBell size="20px" className="rotate-45" />
            </div>
          </div>
        </div>
        {/* Chat Cards List */}
        <div className="grow overflow-hidden">
          <div className={`flex h-full transition duration-500 ${showUnsavedChats && 'translate-x-[-100%]'}`}>
            <div className="flex h-full w-full shrink-0 flex-col gap-3 overflow-auto">
              {filteredChats.map((chat, i) => (
                <ChatCard key={i} data={chat} />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Right Side: Chat Panel */}
      <ChatPanel />
    </div>
  )
}
