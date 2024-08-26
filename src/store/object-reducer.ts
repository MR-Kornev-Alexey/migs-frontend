import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { MObject } from "@/types/common-types";

interface ObjectState {
  value: MObject[];
}

const initialState: ObjectState = {
  value: [],
};

const objectSlice = createSlice({
  name: 'objects',
  initialState,
  reducers: {
    // Ожидает массив объектов в качестве payload
    addObjects(state, action: PayloadAction<MObject[]>) {
      state.value = action.payload;
    },
  },
});

export const { addObjects } = objectSlice.actions;
export default objectSlice.reducer;
