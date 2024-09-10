'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import Box from "@mui/material/Box";

// Define the structure for additional user information
interface AdditionalUserInfo {
  firstName: string;
  surName: string;
  telegram: string;
  position: string;
  phone: string;
}

// Define the structure for the dataUser prop
interface DataUser {
  additionalUserInfo: AdditionalUserInfo[];
  telegramId: number | null;
  telegramInfo: boolean;
}

// Define the props for the AccountDetailsForm component
interface AccountDetailsFormProps {
  dataUser: DataUser;
  changeData: () => void;
}

export function AccountDetailsForm({ dataUser, changeData }: AccountDetailsFormProps): React.JSX.Element {
  const userInfo = dataUser?.additionalUserInfo[0];
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault(); // Prevent default form submission
      }}
    >
      <Card>
        <CardHeader title="Дополнительные данные" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            {userInfo ? (
              <>
                <Grid md={6} xs={12}>
                  <Typography variant="body1">{userInfo.firstName}</Typography>
                </Grid>
                <Grid md={6} xs={12}>
                  <Typography variant="body1">{userInfo.surName}</Typography>
                </Grid>
                <Grid md={6} xs={12}>
                  <Typography variant="body1">{userInfo.telegram}</Typography>
                </Grid>
                <Grid md={6} xs={12}>
                  <Typography variant="body1">{userInfo.position}</Typography>
                </Grid>
                <Grid md={6} xs={12}>
                  <Typography variant="body1">{userInfo.phone}</Typography>
                </Grid>
                <Grid md={6} xs={12}>
                  {dataUser?.telegramId !== null ?<Typography variant="body1">chatId: {dataUser?.telegramId}</Typography>:
                    <Typography variant="body1"><sup>&#8432;</sup> Нет регистрации в боте</Typography>
                  }
                </Grid>
                <Grid md={6} xs={12}>
                  {dataUser?.telegramId !== null ? <Box>
                    { dataUser?.telegramInfo ?<Typography variant="body1" color='green'><sup>&#8432;</sup> <sup>&#8432;</sup> Оповещение
                        включено</Typography>:
                      <Typography variant="body1" color='red'><sup>&#8432;</sup> <sup>&#8432;</sup> Оповещение выключено</Typography>}
                  </Box>: null}
                </Grid>
              </>
            ) : (
              <Grid xs={12}>
                <Typography variant="body1">Дополнительная информация недоступна</Typography>
              </Grid>
            )}
          </Grid>
        </CardContent>
        <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button onClick={changeData} variant="contained" sx={{width:260, marginBottom: 1}}>
            Изменить
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}
