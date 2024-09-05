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
    }
  },
});

export const {  addSelectedSensorsForCharts } = selectedSensorsForChartsReducerSlice.actions;
export default selectedSensorsForChartsReducerSlice.reducer;
