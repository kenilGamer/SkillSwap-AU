import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./chatSlice";
import forumAnswersReducer from './forumAnswersSlice';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    forumAnswers: forumAnswersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
