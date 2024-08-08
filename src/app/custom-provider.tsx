import * as React from 'react';
import '@/styles/global.css';
import { UserProvider } from '@/contexts/user-context';
import { LocalizationProvider } from '@/components/core/localization-provider';
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider';
import { useEffect } from 'react';
import type { ApiResult } from '@/types/result-api';
import { organizationClient } from '@/components/dashboard/organizations/organization-client';
import Alert from '@mui/material/Alert';
import type { AlertColor } from '@mui/material';
import { addOrganizations } from '@/store/organization-reducer';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/store/store';
import Box from "@mui/material/Box";

interface CustomProviderProps {
  children: React.ReactNode;
}

const CustomProvider: React.FC<CustomProviderProps> = ({ children }) => {
  const [isMessage, setIsMessage] = React.useState<string>('');
  const [alertColor, setAlertColor] = React.useState<AlertColor>('error');
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchAllOrganization = async () => {
      try {
        const result: ApiResult = await organizationClient.getAllOrganization();
        if (result?.statusCode === 200) {
          // console.log(result);
          setAlertColor('success');
          setIsMessage('Успешное получение данных предприятий');
          setTimeout(() => {
            setIsMessage('');
          }, 2000);
          dispatch(addOrganizations(result?.allOrganizations));
        } else {
          setAlertColor('error');
          setIsMessage(result?.data?.message || 'Произошла ошибка получения данных организаций');
        }
      } catch (error) {
        console.error('Ошибка при регистрации:', error);
        setAlertColor('error');
        setIsMessage('Произошла ошибка');
      }
    };
    fetchAllOrganization();
  }, []);

  return (
    <LocalizationProvider>
      <UserProvider>
        <ThemeProvider>

  {isMessage && (
    <Box  display="flex" justifyContent="center" alignItems="center">
      <Alert sx={{ marginTop: 2 }} color={alertColor}>
        {isMessage}
      </Alert>
    </Box>
  )}
          {children}
  </ThemeProvider>
  </UserProvider>
  </LocalizationProvider>
);
};

export default CustomProvider;
