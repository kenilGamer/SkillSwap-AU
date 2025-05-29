import { proxy } from 'valtio';
import { devtools } from 'valtio/utils';

interface Chat {
    _id: string;
    id: string;
    participants: string[];
    lastMessage?: {
        content: string;
        sender: string;
        timestamp: Date;
    };
    unreadCount?: number;
}

const chatStore = proxy({
    chats: [] as Chat[],
    openedChat: null as Chat | null,

    setChats(chats: Chat[]) {
        chatStore.chats = chats;
    },

    setOpenedChat(chat: Chat | null) {
        chatStore.openedChat = chat;
    },
});

devtools(chatStore, { name: 'chatStore', enabled: true });

export default chatStore;
