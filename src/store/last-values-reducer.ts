import {createSlice, type PayloadAction} from '@reduxjs/toolkit';

interface SensorData {
  sensor_id: string; // Assuming sensor_id is a string, adjust if it's a number
}

const initialState: { value: SensorData[] } = {
  value: [],
};

// Create a slice with typed state and actions
const lastValuesSlice = createSlice({
  name: 'lastValues',
  initialState,
  reducers: {
    addLastValues: (state, action: PayloadAction<SensorData[]>) => {
      state.value = action.payload;
    }
  },
});

export const { addLastValues } = lastValuesSlice.actions;
export default lastValuesSlice.reducer;

