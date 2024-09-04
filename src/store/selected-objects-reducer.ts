'use client';

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {MObject} from "@/types/common-types";

const initialState: { value: MObject[] } = {
  value: []
};

const selectedObjectsSlice = createSlice({
  name: 'selectedObjects',
  initialState,
  reducers: {
    addSelectedObjects(state, action: PayloadAction<MObject[]>) {
      state.value = action.payload;
    },
    clearSelectedObjects(state, action: PayloadAction<MObject[]>) {
      state.value = [];
    },
  },
});

export const { addSelectedObjects, clearSelectedObjects } = selectedObjectsSlice.actions;
export default selectedObjectsSlice.reducer;
