'use client';
import { AdditionalSensorInfo, SensorInfo } from '@/types/sensor';
import { BASE_URL } from '@/config';
import calculateRequestCode from '@/lib/calculate/calculate-request-code';
import { getHeaders } from '@/lib/common-api/get-header';
import postData from '@/lib/common/post-data';

// Define types for request payloads and responses
interface GetEmailResponse {
  email: string;
}

interface SensorData {
  email: string;
  sensorsData?: SensorInfo;
  requestData?: any;
  jsonData?: any;
  logsData?: any;
  ip?: string;
  id?: string;
  network_number?: number;
  sensor_id?: string;
  value?: any;
  flag?: any;
  periodicity?: number;
  object_id?: string;
  additionalDataForSensor?: AdditionalSensorInfo;
  requestDataForSensor?: any;
  file?: FormData; // Used for file uploads
}

export class SensorsClient {

  private async getEmail(): Promise<string> {
    const headers = await getHeaders();
    const email = headers.email;
    if (!email) {
      throw new Error('Email not found in headers');
    }
    return email;
  }

  private async getHeadersWithEmail(): Promise<Record<string, string>> {
    const headers = await getHeaders();
    return {
      ...headers,
      'Content-Type': 'application/json',
    };
  }

  async getAllSensors(): Promise<any> {
    const email = await this.getEmail();
    const sendData: { email: string } = { email };
    return postData(`${BASE_URL}/sensors/get_all_sensors`, sendData, await this.getHeadersWithEmail());
  }

  async changeTimeRequest(sendData: SensorData): Promise<any> {
    sendData.email = await this.getEmail();
    return postData(`${BASE_URL}/sensors/change_time_request_sensors`, sendData, await this.getHeadersWithEmail());
  }

  async getAllTypeOfSensors(): Promise<any> {
    const email = await this.getEmail();
    const sendData: { email: string } = { email };
    return postData(`${BASE_URL}/sensors/get_all_type_of_sensors`, sendData, await this.getHeadersWithEmail());
  }

  async initNewAllTypeOfSensors(jsonData: any): Promise<any> {
    const email = await this.getEmail();
    const sendData: { jsonData: any; email: string } = { email, jsonData };
    return postData(`${BASE_URL}/sensors/init_all_new_type_sensor`, sendData, await this.getHeadersWithEmail());
  }

  async addLogDataForSensor(formData: FormData): Promise<any> {
    const email = await this.getEmail();
    formData.append('email', email);
    try {
      const response = await fetch(`${BASE_URL}/sensors/set_log_data_for_sensor`, {
        method: 'POST',
        headers: {
          ...await this.getHeadersWithEmail(),
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Произошла ошибка:', (error as Error).message);
      return { error: (error as Error).message };
    }
  }

  async changeIPForSensor(ip: string, id: string): Promise<any> {
    const email = await this.getEmail();
    const sendData: { ip: string; id: string; email: string } = { email, ip, id };
    return postData(`${BASE_URL}/sensors/change_ip_for_sensor`, sendData, await this.getHeadersWithEmail());
  }

  async changeNetAddressSensor(netAddress: string, id: string): Promise<any> {
    const email = await this.getEmail();
    const sendData: { id: string; email: string; network_number: number } = { email, network_number: Number(netAddress), id };
    return postData(`${BASE_URL}/sensors/change_net_address_for_sensor`, sendData, await this.getHeadersWithEmail());
  }

  async changeWarningSensor(sensor_id: string): Promise<any> {
    const email = await this.getEmail();
    const sendData: { sensor_id: string; email: string } = { email, sensor_id };
    return postData(`${BASE_URL}/sensors/change_warning_one_sensor`, sendData, await this.getHeadersWithEmail());
  }

  async saveFileAboutSensor(formData: FormData): Promise<any> {
    const email = await this.getEmail();
    formData.append('email', email);
    try {
      const response = await fetch(`${BASE_URL}/sensors/save_file_about_sensor`, {
        method: 'POST',
        headers: {
          // Fetch automatically sets the 'Content-Type' to 'multipart/form-data' for FormData
          ...await this.getHeadersWithEmail(),
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Произошла ошибка:', (error as Error).message);
      return { error: (error as Error).message };
    }
  }

  async addAdditionalDataForSensor(additionalDataForSensor: AdditionalSensorInfo): Promise<any> {
    const email = await this.getEmail();
    const sendData: { additionalDataForSensor: AdditionalSensorInfo; email: string } = { email, additionalDataForSensor };
    return postData(`${BASE_URL}/sensors/set_additional_data_for_sensor`, sendData, await this.getHeadersWithEmail());
  }

  async addRequestDataForSensor(requestDataForSensor: any): Promise<any> {
    const email = await this.getEmail();
    requestDataForSensor.periodicity = Number(requestDataForSensor.periodicity);
    const sendData: { email: string; requestDataForSensor: any } = { email, requestDataForSensor };
    return postData(`${BASE_URL}/sensors/set_request_data_for_sensor`, sendData, await this.getHeadersWithEmail());
  }

  async importNewSensorsToObject(object_id: string, csv: any): Promise<any> {
    const email = await this.getEmail();
    const sendData: { sensorsData: any; object_id: string; email: string } = { email, object_id, sensorsData: csv };
    return postData(`${BASE_URL}/sensors/import_new_sensors_to_object`, sendData, await this.getHeadersWithEmail());
  }

  async setNewSensorToObject(sensorData: SensorInfo, requestData: any): Promise<any> {
    const email = await this.getEmail();
    const sendData: { sensorsData: SensorInfo; requestData: any; email: string } = { email, sensorsData: sensorData, requestData };
    return postData(`${BASE_URL}/sensors/set_new_sensor_to_object`, sendData, await this.getHeadersWithEmail());
  }

  async changeValuesDataSensor(value: any, flag: any, id: string): Promise<any> {
    const email = await this.getEmail();
    const sendData: { flag: any; id: string; value: any; email: string } = { email, value, flag, id };
    return postData(`${BASE_URL}/sensors/change_value_one_sensor_from_api`, sendData, await this.getHeadersWithEmail());
  }

  async changeDesignationOneSensorFromApi(id: string, value: any): Promise<any> {
    const email = await this.getEmail();
    const sendData: { id: string; designation: any; email: string } = { email, id, designation: value };
    return postData(`${BASE_URL}/sensors/change_designation_one_sensor_from_api`, sendData, await this.getHeadersWithEmail());
  }

  async setNullForOneSensor(id: string, flag: any): Promise<any> {
    const email = await this.getEmail();
    const sendData: { flag: any; id: string; email: string } = { email, id, flag };
    return postData(`${BASE_URL}/sensors/set_null_for_one_sensor`, sendData, await this.getHeadersWithEmail());
  }

  async sensorDuplication(netNumber: string, id: string, model: string): Promise<any> {
    const email = await this.getEmail();
    const requestData = {
      request_code: await calculateRequestCode(Number(netNumber), model),
      periodicity: 10000,
    };
    const sendData: {
      id: string;
      requestData: { periodicity: number; request_code: string };
      email: string;
      network_number: number;
    } = { email, id, network_number: Number(netNumber), requestData };
    return postData(`${BASE_URL}/sensors/one_sensor_duplication`, sendData, await this.getHeadersWithEmail());
  }

  async changeStatusOneSensorFromApi(value: string): Promise<any> {
    const email = await this.getEmail();
    const sendData: { id: string; email: string } = { email, id: value };
    return postData(`${BASE_URL}/sensors/change_status_one_sensor_from_api`, sendData, await this.getHeadersWithEmail());
  }



  async changeNullOrPeriodForOneSensor(id: string, flag: any, value: number): Promise<any> {
    const email = await this.getEmail();
    const sendData: { flag: any; periodicity: number; id: string; email: string } = { email, id, flag, periodicity: value };
    return postData(`${BASE_URL}/sensors/change_parameters_for_one_object`, sendData, await this.getHeadersWithEmail());
  }

  async deleteOneSensorFromApi(id: string): Promise<any> {
    const email = await this.getEmail();
    const sendData: { id: string; email: string } = { email, id };
    return postData(`${BASE_URL}/sensors/delete_one_sensor_from_api`, sendData, await this.getHeadersWithEmail());
  }

  async createNewTypeSensor(value: any): Promise<any> {
    const email = await this.getEmail();
    const sendData: { sensorsData: any; email: string } = { email, sensorsData: value };
    return postData(`${BASE_URL}/sensors/create_new_type_sensor`, sendData, await this.getHeadersWithEmail());
  }
}

export const sensorsClient = new SensorsClient();
