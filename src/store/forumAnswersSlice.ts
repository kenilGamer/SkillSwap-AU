import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ForumAnswer {
  userName: string;
  text: string;
  userAvatarUrl?: string;
}
export type AnswersState = Record<number, ForumAnswer[]>;

const initialState: AnswersState = {};

const forumAnswersSlice = createSlice({
  name: 'forumAnswers',
  initialState,
  reducers: {
    addAnswer: (
      state,
      action: PayloadAction<{ questionId: number; answer: ForumAnswer }>
    ) => {
      const { questionId, answer } = action.payload;
      if (!state[questionId]) state[questionId] = [];
      state[questionId].push(answer);
    },
    setAnswers: (state, action: PayloadAction<AnswersState>) => {
      return action.payload;
    },
  },
});

export const { addAnswer, setAnswers } = forumAnswersSlice.actions;
export default forumAnswersSlice.reducer; 