'use client';

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {type MObject} from "@/types/common-types";

const initialState: { value: MObject[] } = {
  value: []
};

const selectedObjectsForChatsSlice = createSlice({
  name: 'selectedObjectForCharts',
  initialState,
  reducers: {
    addSelectedObjectForCharts(state, action: PayloadAction<MObject[]>) {
      state.value = action.payload;
    },
    clearSelectedObjectForCharts(state) {
      state.value = [];
    },
  },
});

export const { addSelectedObjectForCharts, clearSelectedObjectForCharts } = selectedObjectsForChatsSlice.actions;
export default selectedObjectsForChatsSlice.reducer;
