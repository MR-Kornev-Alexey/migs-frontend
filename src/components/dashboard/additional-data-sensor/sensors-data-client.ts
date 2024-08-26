'use client';

import {BASE_URL} from '@/config';
import {getHeaders} from '@/lib/common-api/get-header';
import {type ApiResult} from "@/types/result-api";
import {NewSensor} from "@/types/common-types";

interface SendData {
  objectIds: string[];
  email: string;
}

export class SensorsDataClient {
  async getLastValuesDataForSelectedSensors(objectId: string, sensorIds: NewSensor[] ): Promise<ApiResult> {
    try {
      const headers = await getHeaders();
      const getEmail = headers.email;
      const sendData: { objectId: string; email: string | undefined; sensorIds: NewSensor[] } = {
        objectId,
        email: getEmail,
        sensorIds
      };
      const response = await fetch(`${BASE_URL}/sensors_data/get_last_values_data_for_selected_sensors`, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sendData),
      });

      // Check if the response is successful
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Something went wrong');
      }

      const data = await response.json();

      return { data };

    } catch (error: any) {
      console.error('Произошла ошибка:', error.message);
      return { error: error.message };
    }
  }
  async getGroupedDataForSelectedObject(sendData: any): Promise<ApiResult> {
    try {
      const headers = await getHeaders();
      sendData.email = headers.email
      const response = await fetch(`${BASE_URL}/sensors_data/get_grouped_data_for_selected_object`, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sendData),
      });

      // Check if the response is successful
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Something went wrong');
      }

      const data = await response.json();

      return { data };

    } catch (error: any) {
      console.error('Произошла ошибка:', error.message);
      return { error: error.message };
    }
  }
}

export const sensorsDataClient = new SensorsDataClient();
