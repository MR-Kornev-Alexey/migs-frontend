'use client';

import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';

import { organizationClient } from '@/lib/organizations/organization-client';
import CheckOrganisation from '@/lib/organizations/check-organization';
import { SignUpFormOrganization } from '@/lib/organizations/sign-up-form-organization';
import { GuestGuard } from '@/components/auth/guest-guard';
import { Layout } from '@/components/auth/layout';


function Page(): React.JSX.Element {
  const [initialData, setInitialData] = React.useState(null);
  const [statusInit, setStatusInit] = React.useState(false);
  const [isMain, setIsMain] = React.useState(true);
  const [isMessage, setIsMessage] = React.useState('');
  const [isError, setIsError] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const result: any = await organizationClient.checkOrganization({ inn: '7716852062' });
        if (result?.data?.statusCode === 200) {
          setStatusInit(true);
          setIsMain(false);
          setInitialData(result?.data?.organization);
          setIsMessage('');
        }
      } catch (error:any) {
        console.error('Ошибка при записи данных:', error);
        setIsMessage('Ошибка проверки данных');
        setIsError(true);
      }
    };

    fetchData();
  }, []);

  const closeModal = (shouldClose: boolean) => {
    if (shouldClose) {
      console.log("Closing modal");
    }
  };

  const renderContent = () => {
    if (isError) {
      return (
        <Alert sx={{ marginTop: 2 }} color="error">
          {isMessage}
        </Alert>
      );
    } 
      return statusInit ? (
        <CheckOrganisation initialData={initialData} />
      ) : (
        <SignUpFormOrganization
          isMain={isMain}
          onRegistrationSuccess={handleRegistrationSuccess}
          closeModal={closeModal}  // Pass closeModal function
        />
      );
    
  };
  const handleRegistrationSuccess = (result: any) => {
    setStatusInit(true);
    setInitialData(result?.data?.organization);
  };

  return (
    <Layout>
      <GuestGuard>
        <Box>{renderContent()}</Box>
      </GuestGuard>
    </Layout>
  );
}

export default Page;
