import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { UserData } from '@/types/user-data';

const initialState = {
  value: 'первый раз', // Установите начальное значение текста здесь
};

const additionalDataOfSensorSlice = createSlice({
  name: 'additionalDataOfSensor',
  initialState,
  reducers: {
    setAdditionalDataOfSensor(state, action: PayloadAction<any>) {
      state.value = action.payload;
    },
  },
});

export const { setAdditionalDataOfSensor } = additionalDataOfSensorSlice.actions;
export default additionalDataOfSensorSlice.reducer;
