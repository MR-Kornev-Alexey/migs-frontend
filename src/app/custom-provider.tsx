import * as React from 'react';
import '@/styles/global.css';
import {UserProvider} from '@/contexts/user-context';
import {LocalizationProvider} from '@/components/core/localization-provider';
import {ThemeProvider} from '@/components/core/theme-provider/theme-provider';
import {useEffect} from 'react';
import type {ApiResult} from '@/types/result-api';
import {organizationClient} from '@/components/dashboard/organizations/organization-client';
import Alert from '@mui/material/Alert';
import type {AlertColor} from '@mui/material';
import {addOrganizations} from '@/store/organization-reducer';
import {useDispatch} from 'react-redux';
import type {AppDispatch} from '@/store/store';
import Box from "@mui/material/Box";
import {objectClient} from "@/components/dashboard/objects/object-client";
import {sensorsClient} from "@/components/dashboard/sensors/sensors-client";
import {addObjects} from "@/store/object-reducer";
import {addTypeOfSensors} from "@/store/type-of-sensors-reducer";
import {type AnyAction} from "redux";
import {addSensors} from "@/store/sensors-reducer";

interface CustomProviderProps {
  children: React.ReactNode;
}

const CustomProvider: React.FC<CustomProviderProps> = ({children}) => {
  const [isMessage, setIsMessage] = React.useState<string>('');
  const [alertColor, setAlertColor] = React.useState<AlertColor>('error');
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const promises: Promise<ApiResult>[] = [
          organizationClient.getAllOrganization(),
          objectClient.getAllObjects(),
          sensorsClient.getAllTypeOfSensors(),
          sensorsClient.getAllSensors()
        ];
        const [orgResult, objResult, typeResult, sensorResult] = await Promise.allSettled(promises);
        handleResult(orgResult, "организаций", addOrganizations, "allOrganizations");
        handleResult(objResult, "объектов", addObjects, "allObjects");
        handleResult(typeResult, "типов датчиков", addTypeOfSensors, "allSensorsType");
        handleResult(sensorResult, "датчиков", addSensors, "allSensors");

      } catch (error) {
        console.error("Ошибка при получении данных:", error);
        setAlertColor("error");
        setIsMessage("Произошла ошибка при получении данных");
      }
    };

    const handleResult = (
      result: PromiseSettledResult<ApiResult>,
      entityName: string,
      dispatchAction: (data: any[]) => AnyAction,
      dataKey: keyof ApiResult
    ) => {
      if (result.status === "fulfilled") {
        if (result.value.statusCode === 200) {
          setAlertColor("success");
          setIsMessage(`Успешное получение данных ${entityName}`);
          setTimeout(() => {
            setIsMessage("");
          }, 2000);
          dispatch(dispatchAction(result.value[dataKey] || []));
        } else {
          setAlertColor("error");
          setIsMessage(
            result.value.data?.message || `Произошла ошибка получения данных ${entityName}`
          );
        }
      } else {
        console.error(`Ошибка при получении данных ${entityName}:`, result.reason);
        setAlertColor("error");
        setIsMessage(`Произошла ошибка получения данных ${entityName}`);
      }
    };

    fetchData();
  }, [dispatch]);

  return (
    <LocalizationProvider>
      <UserProvider>
        <ThemeProvider>
          {isMessage && (
            <Box display="flex" justifyContent="center" alignItems="center">
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
