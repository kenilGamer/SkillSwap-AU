import { BsThreeDotsVertical } from "react-icons/bs";
import { MdDelete, MdOutlineReport } from "react-icons/md";
import { BsSend } from "react-icons/bs";
import { ImAttachment } from "react-icons/im";
import { useRef, useEffect, useState } from "react";
import { useSnapshot } from "valtio";
import userStore from "@/store/user.store";
import chatStore from "@/store/chat.store";
import { Input } from "@/components/shadcn/ui/input";
import { Button } from "@/components/Button";
import ChatBubble from "./ChatBubble";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/shadcn/ui/dropdown-menu";
import io from "socket.io-client";
import axios from "axios";
// Initialize Socket.IO client
const socket = io("http://localhost:4000");

export default function ChatPanel() {
  const { user } = useSnapshot(userStore);
  const { openedChat } = useSnapshot(chatStore);
  const chatBox = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<{ sender: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [chatPartner, setChatPartner] = useState<any>(null);

  // Listen for socket messages
  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      if (msg.chatId === openedChat?._id) {
        setMessages((prev) => {
          const updated = [...prev, msg];
          return updated;
        });
      }
    });
    return () => {
      socket.off("receiveMessage");
    };
  }, [openedChat?._id]);

  // Auto-scroll chat box on new messages
  useEffect(() => {
    if (chatBox.current) {
      setTimeout(() => {
        if (chatBox.current) {
          chatBox.current.scrollTop = chatBox.current.scrollHeight;
        }
      }, 100);
    }
  }, [messages]);

  // Join the chat room and fetch previous messages when openedChat changes
  useEffect(() => {
    if (openedChat?._id) {
      socket.emit("joinChat", openedChat._id);
      const local = localStorage.getItem(`chat-messages-${openedChat._id}`);
      if (local) {
        setMessages(JSON.parse(local));
      } else {
        axios.get(`/api/chat/${openedChat._id}`)
          .then(res => {
            if (Array.isArray(res.data.messages)) {
              setMessages(res.data.messages);
            }
          })
          .catch((err) => {
            if (err.response && err.response.status === 404) {
              setMessages([]);
            }
          });
      }
    }
  }, [openedChat?._id]);

  useEffect(() => {
    if (openedChat?.participants && user?._id) {
      let otherUserId = openedChat.participants.find((id: string) => id !== user._id);
      // If not found (self-chat), use current user's ID
      if (!otherUserId && openedChat.participants.includes(user._id)) {
        otherUserId = user._id;
      }
      if (otherUserId) {
        axios.get(`/api/users/${otherUserId}`)
          .then(res => {
            setChatPartner(res.data.user);
          })
          .catch(() => {
            setChatPartner(null); // Gracefully handle 404 or other errors
          });
      }
    }
  }, [openedChat, user?._id]);

  useEffect(() => {
    if (openedChat?._id) {
      localStorage.setItem(`chat-messages-${openedChat._id}`, JSON.stringify(messages));
    }
  }, [messages, openedChat?._id]);

  if (!openedChat)
    return (
      <div className="flex h-full w-full items-center justify-center text-black/60">
        No chat is selected
      </div>
    );
    const chatPartnerName = chatPartner?.username || chatPartner?.name || "Unknown User";
  

  // Emit message to server
  const sendMessage = () => {
    if (input.trim()) {
      const newMessage = { chatId: openedChat._id, sender: user.username, content: input };
      socket.emit("sendMessage", newMessage);
      setInput("");
    }
  };

  return (
    <div className="flex grow flex-col overflow-hidden bg-accent">
      {/* Chat Header */}
      <div className="flex h-16 items-center justify-between bg-white px-6 shadow-[0px_0px_3px_#00000040]">
        <div className="flex h-full gap-2 rounded-lg py-2 pl-1">
          <div className="aspect-square h-full overflow-hidden rounded-full">
            <img
              className="block h-full w-full object-cover"
              src="https://img.freepik.com/premium-photo/handsome-young-businessman-shirt-eyeglasses_85574-6228.jpg"
              alt="User Avatar"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="font-medium text-gray-800">{chatPartnerName}</h1>
            <span className="block text-sm">Online</span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="ml-auto p-1">
            <div className="cursor-pointer text-black/60">
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

      {/* Chat Messages */}
      <div ref={chatBox} className="flex grow flex-col overflow-auto px-9">
        <div className="grow"></div>
        {messages.map((msg, i) => (
          <ChatBubble key={i} message={msg.content} hisChat={msg.sender !== user.username} />
        ))}
      </div>

      {/* Message Input */}
      <div className="mt-5 flex h-[85px] items-center gap-3 px-7 py-5">
        <div className="relative h-full w-full">
          <Input
            className="h-full rounded-full bg-white pl-5 transition-none placeholder:text-gray-700 focus:bg-accent"
            placeholder="Message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <ImAttachment className="absolute right-3 top-1/2 -translate-y-1/2" />
        </div>
        <Button className="rounded-full" onClick={sendMessage}>
          <BsSend size="20px" color="white" />
        </Button>
      </div>
    </div>
  );
}
