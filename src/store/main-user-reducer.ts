'use client';

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { type UserData } from '@/types/user-data';

interface UserState {
  data: UserData | null;
  loading: boolean;
  error: string | null;
  value: string[] | null;
}

const initialState: UserState = {
  data: null,
  loading: false,
  error: null,
  value: null
};

const mainUserSlice = createSlice({
  name: 'mainUser',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<any>) {
      state.value = action.payload;
    },
  },
});

export const { setUser } = mainUserSlice.actions;
export default mainUserSlice.reducer;
