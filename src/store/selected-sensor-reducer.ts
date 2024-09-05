'use client';

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const initialState: { value: string } = {
  value: '',
};

const selectedSensorSlice = createSlice({
  name: 'selectedSensor',
  initialState,
  reducers: {
    addSelectedSensor(state, action: PayloadAction<string>) {
      state.value = action.payload;
    },
    clearSelectedSensors(state) {
      state.value = '';
    },
  },
});

export const { addSelectedSensor, clearSelectedSensors } = selectedSensorSlice.actions;
export default selectedSensorSlice.reducer;
