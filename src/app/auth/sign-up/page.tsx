'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { paths } from '@/paths';
import { customersClient } from '@/lib/customers/customers-client';
import { GuestGuard } from '@/components/auth/guest-guard';
import { Layout } from '@/components/auth/layout';
import { SignUpForm } from '@/components/auth/sign-up-form';

export default function Page(): React.JSX.Element {
  const [statusInit, setStatusInit] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const responseCheckOrganization:any = await customersClient.findRoleCustomer();
        if (responseCheckOrganization?.data.statusCode === 200) {
          setStatusInit(true);
        } else {
          setStatusInit(false);
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };
    fetchData();
  }, []);
  return (
    <Layout>
      <GuestGuard>
        {statusInit ? (
          <Stack spacing={3}>
            <Stack spacing={1}>
              <Typography variant="h4" sx={{ textAlign: 'center' }}>
                Регистрация Supervisor произведена
              </Typography>
            </Stack>
            <Box>
              <Link component={RouterLink} href={paths.auth.signIn} underline="hover" variant="h5">
                Перейти &gt;&gt;
              </Link>
            </Box>
          </Stack>
        ) : (
          <SignUpForm />
        )}
      </GuestGuard>
    </Layout>
  );
}
