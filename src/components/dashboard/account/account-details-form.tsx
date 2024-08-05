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
        console.log(event);
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
              </>
            ) : (
              <Grid xs={12}>
                <Typography variant="body1">Дополнительная информация недоступна</Typography>
              </Grid>
            )}
          </Grid>
        </CardContent>
        <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button onClick={changeData} variant="contained">
            Изменить
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}
