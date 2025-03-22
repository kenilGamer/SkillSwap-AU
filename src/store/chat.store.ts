import { proxy } from 'valtio';
import { devtools } from 'valtio/utils';

const chatStore = proxy({
  chats: [] as any[],
  openedChat: null as any | null,

  setChats(chats: any[]) {
    console.log("Setting chats in store:", chats);
    chatStore.chats = chats;
  },

  setOpenedChat(id: string) {
    console.log("Opening chat with id:", id);
    const chat = chatStore.chats.find((chat) => chat._id.toString() === id);
    console.log("Found chat:", chat);
    chatStore.openedChat = chat || null;
  },
});

devtools(chatStore, { name: 'chatStore', enabled: true });

export default chatStore;
