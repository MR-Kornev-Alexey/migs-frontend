import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ObjectState {
  value: any[];
}

const initialState: ObjectState = {
  value: [],
};

const objectSlice = createSlice({
  name: 'objects',
  initialState,
  reducers: {
    addObjects(state, action: PayloadAction<any[]>) {
      state.value = action.payload; // Заменяем текущие объекты на новые
    },
  },
});

export const { addObjects } = objectSlice.actions;
export default objectSlice.reducer;
