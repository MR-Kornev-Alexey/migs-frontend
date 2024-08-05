'use client';

import additionalDataOfSensorReducer from '@/store/additionalDataOfSensorReducer';
import lastValuesReducer from '@/store/lastValuesReducer';
import objectReducer from '@/store/objectReducer';
import selectedSensorReducer from '@/store/selectedSensorReducer';
import sensorsReducer from '@/store/sensorsReducer';
import typeOfSensorsReducer from '@/store/typeOfSensorsReducer';
import { combineReducers } from '@reduxjs/toolkit';

import addUserReducer from './addUserReducer';
import mainUserReducer from './mainUserReducer';
import notificationReducer from './notificationReducer';
import userReducer from './userReducer';

// Объединяем редюсеры

const rootReducer = combineReducers({
  user: userReducer,
  lastValues: lastValuesReducer,
  addUser: addUserReducer,
  mainUser: mainUserReducer,
  notifications: notificationReducer,
  selectedSensor: selectedSensorReducer,
  allSensors: sensorsReducer,
  allTypesOfSensors: typeOfSensorsReducer,
  allObjects: objectReducer,
  additionalDataOfSensor: additionalDataOfSensorReducer,
});

export default rootReducer;
