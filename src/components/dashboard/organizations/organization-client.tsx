'use client';

import {BASE_URL} from '@/config';
import type {Result, SendData} from '@/types/result-api';
import {getHeaders} from '@/lib/common-api/get-header';
import {type FormDataOrganization} from "@/types/form-data-organization";

export class OrganizationClient {
  async checkOrganization(value: any): Promise<Result> {
    const url = `${BASE_URL}/organization/check_organization`;
    try {
      const headers = await getHeaders();
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(value),
      });
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Произошла ошибка:', (error as Error).message);
      return {error: (error as Error).message};
    }
  }

  async initMainOrganization(formDataOrganization: FormDataOrganization): Promise<Result> {
    const url = `${BASE_URL}/organization/initial_main_organization`;
    try {
      const headers = await getHeaders();
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(formDataOrganization),
      });

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Произошла ошибка:', (error as Error).message);
      return {error: (error as Error).message};
    }
  }

  async createNewOrganization(formDataOrganization: FormDataOrganization): Promise<Result> {
    const url = `${BASE_URL}/organization/create_new_organization`;

    try {
      const headers = await getHeaders();
      const sentData = {
        email: headers.email, // Access email from headers
        organizationsData: formDataOrganization,
      };

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(sentData),
      });

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Произошла ошибка:', (error as Error).message);
      return {error: (error as Error).message};
    }
  }

  async deleteOneOrganization(id:string) {
    const url = `${BASE_URL}/organization/delete_one_organization`;
    try {
      const headers = await getHeaders();
      const sentData = {
        email: headers.email, // Access email from headers
        organizationId: id
      };

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(sentData),
      });

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Произошла ошибка:', (error as Error).message);
      return {error: (error as Error).message};
    }
  }

  async getAllOrganization() {
    const url = `${BASE_URL}/organization/get_all_organizations`;
    try {
      const headers = await getHeaders();
      const response = await fetch(url, {
        method: 'get',
        headers,
      });
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Произошла ошибка:', (error as Error).message);
      return {error: (error as Error).message};
    }
  }

}

export const organizationClient = new OrganizationClient();
