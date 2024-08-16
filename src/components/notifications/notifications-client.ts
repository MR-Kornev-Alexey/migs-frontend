import { BASE_URL } from '@/config';
import { getHeaders } from "@/lib/common-api/get-header";

// Определите типы для данных, которые вы отправляете и получаете
interface Notification {
  id: string;
  message: string;
  timestamp: string;
  // Добавьте другие поля в зависимости от структуры ваших данных
}

interface GetAllNotificationsResponse {
  notifications: Notification[];
  // Добавьте другие поля в зависимости от ответа API
}

interface GetNotificationsLastDayResponse {
  notifications: Notification[];
  // Добавьте другие поля в зависимости от ответа API
}

interface SendData {
  email: string;
  period: string[];
}

export class NotificationsClient {
  private async getEmail(): Promise<string> {
    const headers = await getHeaders();
    const email = headers.email;
    if (!email) {
      throw new Error('Email not found in headers');
    }
    return email;
  }

  async getAllNotificationsFromApi(sendData: SendData): Promise<GetAllNotificationsResponse | { error: string }> {
    sendData.email = await this.getEmail();
    const headers = await getHeaders();
    try {
      const response = await fetch(`${BASE_URL}/notifications/get_all_notifications`, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sendData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Произошла ошибка:', (error as Error).message);
      return { error: (error as Error).message };
    }
  }

  async getNotificationsLastDayFromApi(): Promise<GetNotificationsLastDayResponse | { error: string }> {
    const headers = await getHeaders();
    const getEmail: string = await this.getEmail();
    const sendData: { email: string } = { email: getEmail };
    try {
      const response = await fetch(`${BASE_URL}/notifications/get_notifications_last_day`, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sendData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Произошла ошибка:', (error as Error).message);
      return { error: (error as Error).message };
    }
  }
}

export const notificationsClient = new NotificationsClient();
