'use client';

import { FormAdditionalData } from '@/types/form-additional-data';
import { BASE_URL } from '@/config';
import { getHeaders } from '@/lib/common-api/get-header';
// Define a type for API response
interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export class CustomersClient {
  async fetchWrapper<T>(url: string, options: RequestInit): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
      }
      return { data };
    } catch (error) {
      console.error('Произошла ошибка:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getCustomers(): Promise<ApiResponse<any>> {
    const headers = await getHeaders();
    const sendData = {
      email: headers.email!,
    };
    return this.fetchWrapper<any>(`${BASE_URL}/customers/all_customers`, {
      method: 'POST',
      headers,
      body: JSON.stringify(sendData),
    });
  }
  async deleteCustomer(value: string): Promise<ApiResponse<any>> {
    const headers = await getHeaders();
    const sendData = {
      email: headers.email!,
      idCustomer: value,
    };
    return this.fetchWrapper<any>(`${BASE_URL}/customers/delete_one_customer`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify(sendData),
    });
  }

  async initSignAdditionalData(formAdditionalData: { user_id: string; flagEdit: boolean }): Promise<ApiResponse<any>> {
    const headers = await getHeaders();
    const sendData = {
      email: headers.email!,
      addData: formAdditionalData,
    };

    return this.fetchWrapper<any>(`${BASE_URL}/customers/init_additional_data_customer`, {
      method: 'POST',
      headers,
      body: JSON.stringify(sendData),
    });
  }
  async findRoleCustomer(): Promise<ApiResponse<any>> {
    return this.fetchWrapper<any>(`${BASE_URL}/customers/find_role_customer`, {
      method: 'GET',
      headers: await getHeaders(),
    });
  }
  async createNewCustomer(value: any): Promise<ApiResponse<any>> {
    return this.fetchWrapper<any>(`${BASE_URL}/customers/create_new_customer`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify(value),
    });
  }

  async getDataAboutOneCustomer(email: string): Promise<ApiResponse<any>> {
    return this.fetchWrapper<any>(`${BASE_URL}/customers/get_data_about_one_customer`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify({ email }),
    });
  }
}

export const customersClient = new CustomersClient();
