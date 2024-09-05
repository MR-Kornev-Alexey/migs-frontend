'use client';
import lastValuesReducer from '@/store/last-values-reducer';
import objectReducer from '@/store/object-reducer';
import selectedSensorReducer from '@/store/selected-sensor-reducer';
import sensorsReducer from '@/store/sensors-reducer';
import typeOfSensorsReducer from '@/store/type-of-sensors-reducer';
import { combineReducers } from '@reduxjs/toolkit';
import organizationReducer from "@/store/organization-reducer";
import selectedObjectsReducer from "@/store/selected-objects-reducer";
import selectedSensorsForChartsReducer from "@/store/selected-sensors-for-charts-reducer";

const rootReducer = combineReducers({
  lastValues: lastValuesReducer,
  selectedSensorsForCharts: selectedSensorsForChartsReducer,
  selectedObjects: selectedObjectsReducer,
  selectedSensor: selectedSensorReducer,
  allSensors: sensorsReducer,
  allTypesOfSensors: typeOfSensorsReducer,
  allObjects: objectReducer,
  allOrganizations: organizationReducer,
});

export default rootReducer;
