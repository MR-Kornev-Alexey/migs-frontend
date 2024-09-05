import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface OrganizationState {
  value: any[];
}

const initialState: OrganizationState = {
  value: [],
};

const organizationSlice = createSlice({
  name: 'organizations',
  initialState,
  reducers: {
    addOrganizations(state, action: PayloadAction<any[]>) {
      state.value = action.payload; // Заменяем текущие объекты на новые
    },
  },
});

export const { addOrganizations } = organizationSlice.actions;
export default organizationSlice.reducer;
