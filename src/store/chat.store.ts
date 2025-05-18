import { proxy } from 'valtio';
import { devtools } from 'valtio/utils';

const chatStore = proxy({
  chats: [] as any[],
  openedChat: null as any | null,

  setChats(chats: any[]) {

    chatStore.chats = chats;
  },

  setOpenedChat(chat: any) {

    chatStore.openedChat = chat;
  },
});

devtools(chatStore, { name: 'chatStore', enabled: true });

export default chatStore;
