'use client';

// counterReducer.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Начальное состояние счетчика
const initialState = {
  value: 0,
};

// Создание среза (slice) счетчика с помощью createSlice
const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    // Действие для увеличения счетчика на 1
    increment(state) {
      state.value++;
    },
    // Действие для уменьшения счетчика на 1
    decrement(state) {
      state.value--;
    },
    // Действие для установки определенного значения счетчика
    set(state, action: PayloadAction<number>) {
      state.value = action.payload;
    },
  },
});

// Экспорт редюсера и действий (actions)
export const { increment, decrement, set } = counterSlice.actions;
export default counterSlice.reducer;
