import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type MObject } from "@/types/common-types";

interface ObjectState {
  value: MObject[] | undefined;
}

const initialState: ObjectState = {
  value: [],
};

const objectSlice = createSlice({
  name: 'objects',
  initialState,
  reducers: {
    // Ожидает массив объектов в качестве payload
    addObjects(state, action: PayloadAction<MObject[] | undefined>) {
      state.value = action.payload;
    },
  },
});

export const { addObjects } = objectSlice.actions;
export default objectSlice.reducer;
