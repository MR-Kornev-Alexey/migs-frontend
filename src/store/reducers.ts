'use client';

import additionalDataOfSensorReducer from '@/store/additional-data-of-sensor-reducer';
import lastValuesReducer from '@/store/last-values-reducer';
import objectReducer from '@/store/object-reducer';
import selectedSensorReducer from '@/store/selected-sensor-reducer';
import sensorsReducer from '@/store/sensors-reducer';
import typeOfSensorsReducer from '@/store/type-of-sensors-reducer';
import { combineReducers } from '@reduxjs/toolkit';

import addUserReducer from './add-user-reducer';
import mainUserReducer from './main-user-reducer';
import notificationReducer from './notification-reducer';
import userReducer from './user-reducer';
import organizationReducer from "@/store/organization-reducer";

// Объединяем редюсеры

const rootReducer = combineReducers({
  // user: userReducer,
  // lastValues: lastValuesReducer,
  // addUser: addUserReducer,
  // mainUser: mainUserReducer,
  // notifications: notificationReducer,
  // selectedSensor: selectedSensorReducer,
  // allSensors: sensorsReducer,
  allTypesOfSensors: typeOfSensorsReducer,
  allObjects: objectReducer,
  allOrganizations: organizationReducer,
  // additionalDataOfSensor: additionalDataOfSensorReducer,
});

export default rootReducer;
