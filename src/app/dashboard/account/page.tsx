'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import SpinnerWithAlert from '@/lib/common-api/spinner-with-alert';
import { customersClient } from '@/components/dashboard/customers/customers-client';
import { AccountDetailsForm } from '@/components/dashboard/account/account-details-form';
import { AccountInfo } from '@/components/dashboard/account/account-info';
import { ProfileForm } from '@/components/dashboard/account/profile-form';
import {type AlertColor} from "@mui/material";
import {type Organization} from "@/types/customer";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";

interface AdditionalUserInfo {
  firstName: string;
  surName: string;
  telegram: string;
  position: string;
  phone: string;
  name: string;
  email: string;
  role: string;
  telegramId: string;
  telegramInfo: boolean;
  organization: Organization;
  dataUser: DataUser[]
}
interface DataUser {
  name: string;
  email: string;
  role: string;
  telegramId: number | null;
  telegramInfo: boolean;
  organization: Organization;
  additionalUserInfo?: {
    firstName?: string;
    surName?: string;
    telegram?: string;
    position?: string;
    phone?: string;
  };
}

export default function Page(): React.JSX.Element {
  let [checkAdditionalData, setCheckAdditionalData] = React.useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isMessage, setIsMessage] = React.useState<string>('');
  const [alertColor, setAlertColor] = React.useState<AlertColor>('error');
  const [receivedData, setReceivedData] = React.useState<{
    telegramId: null;
    telegramInfo: boolean;
    additionalUserInfo: AdditionalUserInfo[];
  }>({
    telegramId: null,
    telegramInfo: false,
    additionalUserInfo: [] // Initialize with an empty array
  });
  const [flagEdit, setFlagEdit] = useState<boolean>(false);


  const dataUser = localStorage.getItem('custom-auth-token');
  let email = '';
  if (dataUser !== null) {
    email = JSON.parse(dataUser).email;
  }
  useEffect(() => {
    setLoading(false);
    setIsMessage('');

    fetchDataOfUser(email)
      .then((usersData) => {
        switch (usersData?.data?.statusCode) {
          case 200:
            setAlertColor('success');
            setIsMessage(usersData?.data?.message || '');
            setReceivedData(usersData?.data?.customer);
            if (usersData?.data?.customer?.registration_status === 'COMPLETED') {
              setCheckAdditionalData(true);
            } else {
              setCheckAdditionalData(false);
            }
            clearMessageWithDelay();
            setLoading(true);
            break;
          case 400:
          case 500:
            setAlertColor('error');
            setIsMessage(usersData?.data?.message || '');
            clearMessageWithDelay();
            break;
          default:
            // Обрабатываем ошибку
            setAlertColor('error');
            setIsMessage(usersData?.error?.message || 'Произошла ошибка обработки данных');
            clearMessageWithDelay();
            break;
        }
      })
      .catch((error) => {
        console.error('Ошибка при загрузке данных:', error);
      });
  }, []);

  async function fetchDataOfUser(email:string): Promise<any> {
    return await customersClient.getDataAboutOneCustomer(email);
  }

  const successRecorded = (data: any) => {
    setReceivedData(data.customer);
    toggleStatus();
  };

  const clearMessageWithDelay = () => {
    setTimeout(() => {
      setIsMessage('');
    }, 2000);
  };

  const toggleStatus = () => {
    setCheckAdditionalData((checkAdditionalData = !checkAdditionalData));
    if (!checkAdditionalData) {
      setFlagEdit(true);
    }
  };

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Профиль</Typography>
      </div>
      {!loading ? (
        <SpinnerWithAlert isMessage={isMessage} alertColor={alertColor} />
      ) : (
        <Stack spacing={3}>
          <Grid container spacing={3}>
            <Grid lg={4} md={6} xs={12}>
              <AccountInfo dataUser={receivedData} />
            </Grid>
            <Grid lg={8} md={6} xs={12}>
              {checkAdditionalData ? (
                <AccountDetailsForm changeData={toggleStatus} dataUser={receivedData} />
              ) : (
                <ProfileForm
                  changeData={toggleStatus}
                  flagEdit={flagEdit}
                  receivedData={receivedData}
                  successRecorded={successRecorded}
                />
              )}
            </Grid>
          </Grid>
          {receivedData?.telegramId === null ?
          <Box>
            <Typography variant='body1'><sup>&#8432;</sup> Для получения оперативных данных в Телеграмм Боте необходимо зарегестрироваться в Телеграмме</Typography>
          </Box>: null}
          <Box>
            <Typography variant='body1'><sup>&#8432;</sup>  <sup>&#8432;</sup> Включение/выключение оповещения производится в Телеграмм Боте</Typography>
          </Box>
          <Link sx={{marginTop:1}} href='https://t.me/MigsKisBot' target='_blank'><Button variant="contained" sx={{width:260}}>
            Перейти в бот
          </Button>
          </Link>

        </Stack>
      )}
    </Stack>
  );
}
