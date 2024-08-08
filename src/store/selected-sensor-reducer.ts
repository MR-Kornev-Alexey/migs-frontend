'use client';

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const initialState: { value: any[] } = {
  value: [],
};

const selectedSensorSlice = createSlice({
  name: 'selectedSensor',
  initialState,
  reducers: {
    addSelectedSensor(state, action: PayloadAction<any>) {
      state.value = action.payload;
    },
  },
});

export const { addSelectedSensor } = selectedSensorSlice.actions;
export default selectedSensorSlice.reducer;
