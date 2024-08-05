'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { UserData } from '@/types/userData';

const initialState = {
  value: 'Внимание! В базе данных нет ваших данных, прошу внести их', // Установите начальное значение текста здесь
};
// Создание среза (slice) счетчика с помощью createSlice
const addUserSlice = createSlice({
  name: 'addUser',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<any>) {
      state.value = action.payload;
    },
  },
});

// Экспорт редюсера и действий (actions)
export const { setUser } = addUserSlice.actions;
export default addUserSlice.reducer;
