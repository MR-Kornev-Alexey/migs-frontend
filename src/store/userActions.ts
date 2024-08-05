'use client';

import {createAsyncThunk} from '@reduxjs/toolkit';

import {UserData} from '@/types/userData'; // Предположим, что у вас есть тип UserData для данных пользователя

export const getUserData = createAsyncThunk<UserData, void>('user/getUserData', async () => {
  try {
    const response = await fetch('/api/user');
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    throw error;
  }
});
