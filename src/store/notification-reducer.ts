'use client';

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const initialState: { value: any[] } = {
  value: [],
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotifications(state, action: PayloadAction<any>) {
      state.value.push(action.payload);
    },
  },
});

export const { addNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;
