'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: { value: any[] } = {
  value: [],
};

const sensorsSlice = createSlice({
  name: 'allTypesOfSensors',
  initialState,
  reducers: {
    addTypeOfSensors(state, action: PayloadAction<any>) {
      state.value = action.payload;
    },
  },
});

export const { addTypeOfSensors } = sensorsSlice.actions;
export default sensorsSlice.reducer;
