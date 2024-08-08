'use client';

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { type UserData } from '@/types/user-data';

// Use the UserData interface to define the type of data in the state
interface UserState {
  data: UserData | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  data: null,
  loading: false,
  error: null,
};

// Create a slice for user state with createSlice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserData>) {
      state.data = action.payload; // Update data instead of value
    },
  },
});

// Export reducer and actions
export const { setUser } = userSlice.actions;
export default userSlice.reducer;
