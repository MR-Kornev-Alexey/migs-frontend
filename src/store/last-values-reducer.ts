import {createSlice, type PayloadAction} from '@reduxjs/toolkit';

// Define a TypeScript interface for the data structure
interface SensorData {
  sensor_id: string; // Assuming sensor_id is a string, adjust if it's a number
  // Add other fields that your items should contain
}

// Use the interface to type the initial state
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
    },
    updateLastValues: (state, action: PayloadAction<SensorData>) => {
      // Get updated data
      const newData = action.payload;
      state.value = state.value.map((item) =>
        item.sensor_id === newData.sensor_id ? { ...item, ...newData } : item
      );
    },
  },
});

// Export the actions and reducer
export const { addLastValues, updateLastValues } = lastValuesSlice.actions;
export default lastValuesSlice.reducer;

