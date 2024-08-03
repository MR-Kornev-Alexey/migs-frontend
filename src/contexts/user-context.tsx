'use client';

import * as React from 'react';

import type { User } from '@/types/user';
import { authClient } from '@/lib/auth/client';
import { logger } from '@/lib/default-logger';

export interface UserContextValue {
  user: User | null;
  error: string | null;
  isLoading: boolean;
  checkSession?: () => Promise<void>;
}

export const UserContext = React.createContext<UserContextValue | undefined>(undefined);

export interface UserProviderProps {
  children: React.ReactNode;
}

export function UserProvider({ children }: UserProviderProps): React.JSX.Element {
  const [state, setState] = React.useState<{ user: User | null; error: string | null; isLoading: boolean }>({
    user: null,
    error: null,
    isLoading: true,
  });
  const checkSession = React.useCallback(async (): Promise<void> => {
    try {
      let email;
      const dataUser: any = localStorage.getItem('custom-auth-token'); // Получение  роли  пользователя из контекста или хранилища
      if (dataUser != null) {
        email = JSON.parse(dataUser).email;
      }

      const { data, error } = await authClient.getUser(email);

      if (error) {
        logger.error(JSON.parse(dataUser));
        setState((prev) => ({ ...prev, user: null, error: 'Ошибка загрузки первый вариант', isLoading: false }));
        return;
      }
      setState((prev) => ({ ...prev, user: data ?? null, error: null, isLoading: false }));
    } catch (err) {
      logger.error(err);
      setState((prev) => ({ ...prev, user: null, error: 'Ошибка загрузки второй вариант ', isLoading: false }));
    }
  }, []);

  React.useEffect(() => {
    checkSession().catch((err) => {
      logger.error(err);
      // noop
    });
  }, []);

  return <UserContext.Provider value={{ ...state, checkSession }}>{children}</UserContext.Provider>;
}

export const UserConsumer = UserContext.Consumer;
