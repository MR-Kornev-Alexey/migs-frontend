'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { RootState } from '@/store/store';
import { Alert, AlertColor } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';

import formatDateTime from '@/lib/common/format-date-time';
import SelectTimePeriod from '@/components/select/select-time-period';
import { notificationsClient } from "@/components/notifications/notifications-client";
import NotificationList from "@/components/notifications/notification-list";
import { ApiResult } from "@/types/result-api"; // Убедитесь, что ApiResult определен

// Тип для объекта уведомления
interface Notification {
  id: string;
  object_id: string;
  created_at: string;
  information: string;
}

// Тип для состояния периодов
interface Period {
  startDate: string;
  endDate: string;
}

export function Notifications(): React.JSX.Element {
  const allObjects = useSelector((state: RootState) => state.allObjects.value);
  const [isPeriod, setIsPeriod] = useState<Period | string[]>([]);
  const [oneHour, setOneHour] = useState<any>();
  const [isNotifications, setIsNotifications] = useState<Notification[]>([]);
  const [isMessage, setIsMessage] = useState<string>('');
  const [alertColor, setAlertColor] = useState<AlertColor>('error');
  const [isTitle, setIsTitle] = useState<string>('За последние сутки');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsMessage('');
        const result = await notificationsClient.getNotificationsLastDayFromApi();
        handleResult(result);
      } catch (error) {
        handleError(error as string, 'Ошибка при загрузке данных');
      }
    };

    fetchNotifications();
  }, []);

  const handleResult = (result: ApiResult) => {
    switch (result?.statusCode) {
      case 200:
        setAlertColor('success');
        setIsMessage(result?.message || 'Успешная загрузка');
        setIsNotifications(result?.notifications || []);
        setTimeout(() => {
          setIsMessage('');
        }, 3000);
        break;
      case 400:
      case 500:
        setAlertColor('error');
        setIsMessage(result?.message || 'Произошла ошибка');
        break;
      default:
        setAlertColor('error');
        setIsMessage(result?.message || 'Произошла ошибка');
        break;
    }
  };

  const handleError = (error: string, defaultMessage: string) => {
    setAlertColor('error');
    console.error(defaultMessage, error);
    setIsMessage(defaultMessage);
  };

  const sendRequestToApi = async () => {
    try {
      setIsMessage('');
      const sendData:any = { period: isPeriod };
      const result = await notificationsClient.getAllNotificationsFromApi(sendData);
      handleResult(result as ApiResult); // Приведение типа
      setIsTitle('Выбранные уведомления');
    } catch (error) {
      handleError(error as string, 'Ошибка при загрузке данных');
    }
  };

  const findNameOfObject = (id: string): string => {
    try {
      const object = allObjects.find((object) => object.id === id);
      return object ? `${object.name} ${object.address}` : 'Объект не найден';
    } catch (error) {
      return 'Ошибка при поиске объекта';
    }
  };

  return (
    <Box>
      <Box>
        <Typography variant="h4">Уведомления</Typography>
      </Box>

      <Box sx={{ marginTop: 2, display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
        <Box sx={{ width: { xs: '100%', md: '33%' } }}>
          <Typography variant="h6" sx={{ my: 2 }}>
            Выберите период
          </Typography>
          <SelectTimePeriod setPeriodToParent={setIsPeriod} setOneHour={setOneHour} />
          <Button variant="contained" onClick={sendRequestToApi} sx={{ width: 220, marginY:2 }} >
            Загрузить
          </Button>
        </Box>
      </Box>
      <Box sx={{ marginY: 2 }}>
        {isNotifications.length === 0 ? (
          <Box><Typography variant="body1">Уведомлений за выбранный период нет</Typography></Box>
        ) : (
          <Box sx={{ marginY: 1 }}>
            <Box>
              <Typography variant="body1">{isTitle}</Typography>
            </Box>
            <NotificationList
              isNotifications={isNotifications}
              findNameOfObject={findNameOfObject}
              formatDateTime={formatDateTime}
            />
          </Box>
        )}
      </Box>
      <Box sx={{ marginY: 2 }}>{isMessage && <Alert color={alertColor}>{isMessage}</Alert>}</Box>
    </Box>
  );
}
