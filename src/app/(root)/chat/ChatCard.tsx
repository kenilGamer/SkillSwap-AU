'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/shadcn/ui/dropdown-menu';
import chatStore from '@/store/chat.store';
import userStore from '@/store/user.store';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdDelete, MdOutlineReport } from 'react-icons/md';
import { useSnapshot } from 'valtio';

export default function ChatCard({ data }: { data: any }) {
  const searchParams = useSearchParams();
  const sender = searchParams?.get('sender');
  const [chats, setChats] = useState();

  useEffect(() => {
    if (!sender) return;

    const fetchChats = async () => {
      try {
        const response = await axios.get(`/api/chat/chats`, {
          params: { sender },
        });
        console.log('Fetched chats:', response.data);
        setChats(response.data.data[0]);
        if (Array.isArray(response.data.data)) {
          // Update the global store instead of local state.
          chatStore.setChats(response.data.data);
        } else {
          console.error('Unexpected data format:', response.data);
          chatStore.setChats([]);
        }
      } catch (error) {
        console.error('Error fetching chats:', error);
        chatStore.setChats([]);
      }
    };

    fetchChats();
  }, [sender]);

  // Determine the chat user's name from the passed data prop.
  const chatUser = data?.username || 'Unknown User';

  return (
    <div
      onClick={() => {
        console.log('Clicked Chat ID:', chatUser._id);
        chatStore.setOpenedChat(chats._id);
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
