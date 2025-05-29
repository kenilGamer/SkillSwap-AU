'use client'

import { Input } from '@/components/shadcn/ui/input'
import { useState } from 'react'
import { MdSearch } from 'react-icons/md'
import ChatCard from './ChatCard'
import ChatPanel from './ChatPanel'
import { useSnapshot } from 'valtio'
import chatStore from '@/store/chat.store'
import NotificationBell from './NotificationBell'

export default function Chat() {
  const [showUnsavedChats, setShowUnsavedChats] = useState(false)
  const { chats } = useSnapshot(chatStore) as typeof chatStore

  return (
    <div className="flex grow overflow-hidden h-screen w-full">
      <div className="relative flex w-[330px] select-none flex-col py-3 shadow-[0px_0px_3px_#00000040]">
        <div className="relative mx-3">
          <MdSearch className="absolute left-2 top-1/2 size-5 -translate-y-1/2 text-black/60" />
          <Input className="pl-8" placeholder="Search..." />
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-medium">
            {showUnsavedChats ? 'Unsaved Chats' : 'Messages'}
          </h1>
          <div
            onClick={() => setShowUnsavedChats(!showUnsavedChats)}
            className="relative cursor-pointer"
          >
            <NotificationBell hasNotification={!showUnsavedChats} />
          </div>
        </div>
        <div className="grow overflow-hidden">
          <div className={`flex h-full transition duration-500 ${showUnsavedChats && 'translate-x-[-100%]'}`}>
            <div className="flex h-full w-full shrink-0 flex-col gap-3 overflow-auto">
              {chats.map((e, i) => (
                <ChatCard key={i} data={e} />
              ))}
            </div>
            <div className="flex w-full shrink-0 flex-col gap-3">
              {<ChatCard data={chats[0]} />}
              {<ChatCard data={chats[1]} />}
            </div>
          </div>
        </div>
      </div>
      <ChatPanel  />
    </div>
  )
}
