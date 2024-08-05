'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { LatestData, SensorInfo } from '@/types/sensor';
import sortSensorsByObjectId from '@/components/dashboard/sensors/sort-sensors-by-objects';

const initialState: { value: SensorInfo[] } = {
  value: [],
};

const sensorsSlice = createSlice({
  name: 'sensors',
  initialState,
  reducers: {
    addSensors(state, action: PayloadAction<any>) {
      state.value = sortSensorsByObjectId(action.payload);
    },
    updateSensors(state, action: PayloadAction<any>) {
      state.value = action.payload;
    },
    updateSensor(state, action: PayloadAction<{ sensorId: string; updatedInfo: any }>) {
      const { sensorId, updatedInfo } = action.payload;
      const sensorIndex = state.value.findIndex((sensor) => sensor.id === sensorId);
      if (sensorIndex !== -1) {
        state.value[sensorIndex].requestSensorInfo = updatedInfo;
      }
    },
    updateLastValueSensor(state, action: PayloadAction<any>) {
      const inputLastValues = action.payload;
      inputLastValues.forEach((input: { [key: string]: any }) => {
        const sensorId = Object.keys(input)[0];
        const newLastValue = input[sensorId];

        const sensorIndex = state.value.findIndex((sensor) => sensor.id === sensorId);
        if (sensorIndex !== -1) {
          state.value[sensorIndex].requestSensorInfo.forEach((info: any) => {
            info.last_base_value = newLastValue;
          });
        }
      });
    },
    updateRequestSensorInfo(state, action: PayloadAction<LatestData[]>) {
      const latestData = action.payload;
      latestData.forEach((latest) => {
        const sensorIndex = state.value.findIndex((sensor) => sensor.id === latest.sensor_id);
        if (sensorIndex !== -1) {
          const sensor = state.value[sensorIndex];
          sensor.requestSensorInfo = sensor.requestSensorInfo.map((info) => {
            if (info.id === latest.id) {
              return { ...info, ...latest };
            }
            return info;
          });
        }
      });
    },
  },
});

export const { addSensors, updateSensors, updateLastValueSensor, updateRequestSensorInfo } = sensorsSlice.actions;
export default sensorsSlice.reducer;
