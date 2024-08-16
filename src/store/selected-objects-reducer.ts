'use client';

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const initialState: { value: string[] } = {
  value: [],
};

const selectedObjectsSlice = createSlice({
  name: 'selectedObjects',
  initialState,
  reducers: {
    addSelectedObjects(state, action: PayloadAction<string[]>) {
      state.value = action.payload;
    },
  },
});

export const { addSelectedObjects } = selectedObjectsSlice.actions;
export default selectedObjectsSlice.reducer;
