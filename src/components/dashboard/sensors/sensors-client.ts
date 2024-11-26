'use client';
import {type AdditionalSensorInfo, type SensorInfo} from '@/types/sensor';
import {BASE_URL} from '@/config';
import calculateRequestCode from '@/lib/calculate/calculate-request-code';
import {getHeaders} from '@/lib/common-api/get-header';
import postData from '@/lib/common/post-data';
import {type DefaultValuesNewSensor} from "@/types/default-values-add-new-sensor";
import {type ApiResult} from "@/types/result-api";

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

  async addLogDataForSensor111(formData: FormData): Promise<any> {
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

  async addLogDataForSensor(sendData:any): Promise<ApiResult> {
    try {
      const email = await this.getEmail();
      return await postData(
        `${BASE_URL}/sensors/set_log_data_for_sensor`,
        { logsData:sendData, email},
        await this.getHeadersWithEmail()
      );
    } catch (error) {
      console.error('Error adding log parameter for sensor:', error);
      throw error;
    }
  }

  async changeIPForSensor(id: string, ip: string): Promise<any> {
    const email = await this.getEmail();
    const sendData: { email: string; ip: string; id: string; } = { email, ip, id };
    return postData(`${BASE_URL}/sensors/change_ip_for_sensor`, sendData, await this.getHeadersWithEmail());
  }

  async changeNetAddressSensor(id: string, netAddress: string): Promise<any> {
    const email = await this.getEmail();
    const sendData: { id: string; email: string; network_number: number } = { email, network_number: Number(netAddress), id };
    return postData(`${BASE_URL}/sensors/change_net_address_for_sensor`, sendData, await this.getHeadersWithEmail());
  }

  async changeWarningSensor(sensor_id: string): Promise<any> {
    const email = await this.getEmail();
    const sendData: { sensor_id: string; email: string } = { email, sensor_id };
    return postData(`${BASE_URL}/sensors/change_warning_one_sensor`, sendData, await this.getHeadersWithEmail());
  }

  async saveFileAboutSensor(file:any, id:any): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('id', id);

    try {
      const response = await fetch(`${BASE_URL}/sensors/save_file_about_sensor`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error; // Выбрасываем ошибку, чтобы она могла быть обработана в вызывающем коде
    }
  }


  async addAdditionalDataForSensor(
    sensorsData: string, // Assuming sensorsId is a string. Adjust type if different.
  ): Promise<ApiResult> {
    try {
      // Fetch the email (assuming getEmail is an async function)
      const email = await this.getEmail();
      const sendData= { additionalSensorsData: sensorsData, email }
      return await postData(
        `${BASE_URL}/sensors/set_additional_data_for_sensor`,
        sendData,
        await this.getHeadersWithEmail()
      );
    } catch (error) {
      // Handle any errors that occur during the process
      console.error('Error adding additional parameter for sensor:', error);
      throw error;
    }
  }
  async addAdditionalParameterForSensor(
    value: string,
    parameter: string,
    sensorsId: string | undefined
  ): Promise<ApiResult> {
    try {
      // Fetch the email (assuming getEmail is an async function)
      const email = await this.getEmail();
      const sendData = {
        sensor_id: sensorsId,
        email,
        parameter,
        value
      };
      // Return the response or handle it as needed
      return await postData(
        `${BASE_URL}/sensors/set_additional_parameter_for_sensor`,
        sendData,
        await this.getHeadersWithEmail()
      );
    } catch (error) {
      // Handle any errors that occur during the process
      console.error('Error adding additional parameter for sensor:', error);
      throw error;
    }
  }

  async addRequestDataForSensor(sendData: {
                                  sensor_id: string | undefined;
                                  parameter: string;
                                  model: string | undefined;
                                  value: string;
                                  object_id: string | undefined;
                                  email: string;
                                }
  ): Promise<ApiResult> {
    try {
      sendData.email =  await this.getEmail();
      // Return the response or handle it as needed
      return await postData(
        `${BASE_URL}/sensors/set_request_parameter_for_sensor`,
        sendData,
        await this.getHeadersWithEmail()
      );
    } catch (error) {
      // Handle any errors that occur during the process
      console.error('Error adding additional parameter for sensor:', error);
      throw error;
    }
  }

  async importNewSensorsToObject(object_id: string, csv: any): Promise<any> {
    const email = await this.getEmail();
    const sendData: { sensorsData: any; object_id: string; email: string } = { email, object_id, sensorsData: csv };
    return postData(`${BASE_URL}/sensors/import_new_sensors_to_object`, sendData, await this.getHeadersWithEmail());
  }

  async setNewSensorToObject(sensorData: DefaultValuesNewSensor, requestData: any): Promise<any> {
    const email = await this.getEmail();
    const sendData: { sensorsData: DefaultValuesNewSensor; requestData: DefaultValuesNewSensor; email: string } = { email, sensorsData: sensorData, requestData };
    return postData(`${BASE_URL}/sensors/set_new_sensor_to_object`, sendData, await this.getHeadersWithEmail());
  }

  async changeValuesDataSensor(data:SensorInfo): Promise<any> {
    const email = await this.getEmail();
    const sendData= {  limitValuesDataSensor: data, email }
    return postData(`${BASE_URL}/sensors/change_limit_values_one_sensor`, sendData, await this.getHeadersWithEmail());
  }

  async changeDesignationOneSensorFromApi(id: string, value: any): Promise<any> {
    const email = await this.getEmail();
    const sendData: { id: string; designation: any; email: string } = { email, id, designation: value };
    return postData(`${BASE_URL}/sensors/change_designation_one_sensor_from_api`, sendData, await this.getHeadersWithEmail());
  }

  async setNullForAllSensorOnObject(object_id: string, set_null: boolean): Promise<any> {
    const email: string = await this.getEmail();
    const sendData= { set_null,  object_id, email };
    return postData(`${BASE_URL}/sensors/set_null_for_all_sensor_on_object`, sendData, await this.getHeadersWithEmail());
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
