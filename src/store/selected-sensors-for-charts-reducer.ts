'use client';

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const initialState: { value: any[] } = {
  value: [],
};

const selectedSensorsForChartsReducerSlice = createSlice({
  name: 'selectedSensorsForCharts',
  initialState,
  reducers: {
    addSelectedSensorsForCharts(state, action: PayloadAction<string[]>) {
      state.value = action.payload;
    },
    clearSelectedSensorsForCharts(state, action: PayloadAction<string>) {
      state.value = [];
    },
  },
});

export const { clearSelectedSensorsForCharts, addSelectedSensorsForCharts } = selectedSensorsForChartsReducerSlice.actions;
export default selectedSensorsForChartsReducerSlice.reducer;
