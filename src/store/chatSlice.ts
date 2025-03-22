import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Chat = {
  _id: string;
  sender: string;
  receiver: string;
  message: string;
  isSeen: boolean;
};

type ChatState = {
  chats: Chat[];
  openedChat: Chat | null;
};

const initialState: ChatState = {
  chats: [],
  openedChat: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChats: (state: ChatState, action: PayloadAction<Chat[]>) => {
      state.chats = action.payload;
    },
    setOpenedChat: (state: ChatState, action: PayloadAction<string>) => {
      state.openedChat = state.chats.find((chat) => chat._id === action.payload) || null;
    },
  },
});

export const { setChats, setOpenedChat } = chatSlice.actions;
export default chatSlice.reducer;
