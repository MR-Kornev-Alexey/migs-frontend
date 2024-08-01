'use client';
import { BASE_URL } from '@/config';

async function getHeaders(): Promise<HeadersInit> {
  const dataUser = localStorage.getItem('custom-auth-token');
  let token = '';
  let email = '';

  if (dataUser !== null) {
    const parsedData = JSON.parse(dataUser);
    token = parsedData.password;
    email = parsedData.email;
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    email,
  };
}

export class OrganizationClient {
  async checkOrganization(value: any): Promise<any> {
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
      return { error: (error as Error).message };
    }
  }

  async getAllOrganization(): Promise<any> {
    const url = `${BASE_URL}/organization/get_all_organizations`;
    try {
      const headers = await getHeaders();
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Произошла ошибка:', (error as Error).message);
      return { error: (error as Error).message };
    }
  }

  async initMainOrganization(formDataOrganization: any): Promise<any> {
    try {
      const headers = await getHeaders();
      const response = await fetch(`${BASE_URL}/organization/initial_main_organization`, {
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
      return { error: (error as Error).message };
    }
  }

  async createNewOrganization(formDataOrganization: any): Promise<any> {
    try {
      const headers = await getHeaders();
      const sentData = {
        email: headers.email,
        organizationsData: formDataOrganization,
      };

      const response = await fetch(`${BASE_URL}/organization/create_new_organization`, {
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
      return { error: (error as Error).message };
    }
  }
}

export const organizationClient = new OrganizationClient();
