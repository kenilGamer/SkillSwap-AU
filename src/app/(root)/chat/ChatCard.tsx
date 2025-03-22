'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/shadcn/ui/dropdown-menu';
import chatStore from '@/store/chat.store';

import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdDelete, MdOutlineReport } from 'react-icons/md';


export default function ChatCard({ data }: { data: any }) {
  const searchParams = useSearchParams();
  const [chats, setChats] = useState();
  const sender = searchParams?.get('sender');



useEffect(() => {
  const fetchChats = async () => {
    try {
      const response = await axios.get(`/api/users/users`, {
        params: { sender },
      });

      if (Array.isArray(response.data.data)) {
        setChats(response.data.data);
      } 
    } catch (error) {
      console.log('error', error);
    }
  };

  fetchChats();
}, [sender]); // ✅ Added 'sender' to dependencies


  // Determine the chat user's name from the passed data prop.
  const chatUser = data?.username || 'Unknown User';

  return (
    <div
      onClick={() => {
        console.log('Clicked Chat ID:', chatUser._id);
        chatStore.setOpenedChat(chats?._id);
      }}
      className="mx-3 flex h-16 cursor-pointer items-center gap-2 rounded-lg border bg-accent p-2 shadow-sm"
    >
      {/* User Avatar */}
      <div className="aspect-square h-full shrink-0 overflow-hidden rounded-full">
        <img
          className="block h-full w-full object-cover"
          src="https://img.freepik.com/premium-photo/handsome-young-businessman-shirt-eyeglasses_85574-6228.jpg"
          alt="User Avatar"
        />
      </div>

      {/* Chat User Info */}
      <div className="flex flex-col justify-center overflow-hidden">
        <h1 className="text-sm font-medium text-black/70">{chatUser}</h1>
        {/* Replace the following with the appropriate logic for showing the last message */}
        <span className="block truncate text-xs font-medium text-black/50">
          No recent messages
        </span>
      </div>

      {/* Dropdown Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="ml-auto p-1">
          <div className="text-black/60">
            <BsThreeDotsVertical />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            Delete
            <DropdownMenuShortcut>
              <MdDelete className="size-4" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-red-400 hover:!text-red-500">
            Report
            <DropdownMenuShortcut>
              <MdOutlineReport className="size-4" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
