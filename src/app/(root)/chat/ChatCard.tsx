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
import { useSnapshot } from 'valtio';

import axios from 'axios';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdDelete, MdOutlineReport } from 'react-icons/md';

export default function ChatCard({ data }: { data: any }) {
  const { user } = useSnapshot(userStore);

  // Determine the chat user's name from the passed data prop.
  const chatUser = data?.username || 'Unknown User';

  // Do not render the card if the data._id is the current user's id
  if (data._id === user._id) {
    return null;
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering card click
    try {
      await axios.delete(`/api/chat/${data._id}`);
      // Remove chat from chatStore.chats
      chatStore.setChats(chatStore.chats.filter((c: any) => c._id !== data._id));
      // Optionally, clear openedChat if it was deleted
      if (chatStore.openedChat?._id === data._id) {
        chatStore.setOpenedChat(null);
      }
    } catch (err) {
      console.error('Failed to delete chat:', err);
    }
  };

  const handleOpenChat = async () => {
    // Find or create a chat between the current user and the selected user
    try {
      const response = await axios.post('/api/chat/chats', {
        senderId: user._id,
        recipientId: data._id,
      });
      if (response.data && response.data.data && response.data.data._id) {
        chatStore.setOpenedChat(response.data.data);
      }
    } catch (err) {
      console.error('Failed to open chat:', err);
    }
  };

  return (
    <div
      onClick={handleOpenChat}
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
          {data.lastMessage?.content || 'No recent messages'}
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
          <DropdownMenuItem onClick={handleDelete}>
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