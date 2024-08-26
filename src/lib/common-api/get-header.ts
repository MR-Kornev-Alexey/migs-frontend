
import { type CustomAdditionalData } from '@/types/custom-additional-data';

export async function getHeaders(): Promise<{
  'Content-Type': string;
  Authorization: string;
  email?: string; // Ensure email is optional if not always provided
}> {
  const dataUser: string | null = localStorage.getItem('custom-auth-token');
  let token = '';
  let email = '';

  if (dataUser !== null) {
    const parsedData:CustomAdditionalData = JSON.parse(dataUser);
    token = parsedData.password;
    email = parsedData.email;
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    email, // Ensure email is an empty string if not provided
  };
}
