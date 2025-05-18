import { proxy } from 'valtio';
import { devtools } from 'valtio/utils';

const chatStore = proxy({
  chats: [] as any[],
  openedChat: null as any | null,

  setChats(chats: any[]) {
    console.log("Setting chats in store:", chats);
    chatStore.chats = chats;
  },

  setOpenedChat(chat: any) {
    console.log("Opening chat with id:", chat);
    chatStore.openedChat = chat;
  },
});

devtools(chatStore, { name: 'chatStore', enabled: true });

export default chatStore;
