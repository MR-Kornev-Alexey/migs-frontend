'use client';

import type { User } from '@/types/user';
import { BASE_URL } from '@/config';

// Mock user object that satisfies the User type
const user = {
  id: 'USR-000',
  avatar: '/assets/avatar.png',
  firstName: 'Sofia',
  lastName: 'Rivers',
  email: 'sofia@devias.io',
} satisfies User;

// Interfaces for method parameters
export interface SignUpParams {
  name: string;
  email: string;
  password: string;
  organizationInn: string;
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

// Define the AuthClient class
class AuthClient {
  // Method for user signup
  async signUp(signUpParams: SignUpParams): Promise<{ error?: string }> {
    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signUpParams), // Convert the object to a JSON string
      });

      // Check if the response is OK
      if (!response.ok) {
        throw new Error('Failed to sign up');
      }

      const data = await response.json();

      // Save user data to localStorage
      localStorage.setItem('custom-auth-token', JSON.stringify(data.user));
      return {};
    } catch (error: any) {
      // Handle errors
      console.error('An error occurred:', error.message);
      return { error: error.message };
    }
  }

  // Method for user sign-in with password
  async signInWithPassword(
    params: SignInWithPasswordParams
  ): Promise<{ error?: string; responseLogin?: any }> {
    try {
      const token = localStorage.getItem('custom-auth-token');
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers,
        body: JSON.stringify(params),
      });

      // Check if the response is OK
      if (!response.ok) {
        throw new Error('Ошибка входа');
      }

      const data = await response.json();

      // Save user data to localStorage
      localStorage.setItem('custom-auth-token', JSON.stringify(data.user));
      return { responseLogin: data };
    } catch (error: any) {
      // Handle errors
      console.error('An error occurred:', error.message);
      return { error: error.message };
    }
  }

  // Placeholder method for password reset
  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  // Placeholder method for password update
  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update password not implemented' };
  }

  // Method to get user data
  async getUser(email: string): Promise<{ data?: User | null; error?: string }> {
    const dataUser = localStorage.getItem('custom-auth-token');
    let token = '';

    // Extract token from localStorage
    if (dataUser != null) {
      token = JSON.parse(dataUser).password;
    }

    if (!token) {
      return { data: null };
    }

    return { data: user };
  }

  // Method for user sign-out
  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('custom-auth-token');
    return {};
  }
}

// Export an instance of the AuthClient class
export const authClient = new AuthClient();
