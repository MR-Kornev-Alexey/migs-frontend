'use client';

import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import { type Organization, type ApiResult } from '@/types/result-api';
import CheckOrganisation from '@/components/dashboard/organizations/check-organization';
import { SignUpFormOrganization } from '@/components/dashboard/organizations/sign-up-form-organization';
import { GuestGuard } from '@/components/auth/guest-guard';
import { Layout } from '@/components/auth/layout';
import { type AlertColor } from '@mui/material';
import { handleApiResult } from '@/lib/common-api/result-handler';
import { fetchOrganizationData } from "@/lib/common-api/fetch-data-check-main";


function Page(): React.JSX.Element {
  const [initialData, setInitialData] = React.useState<Organization | null>(null);
  const [isMain, setIsMain] = React.useState<boolean>(true);
  const [isMessage, setIsMessage] = React.useState<string>('check');
  const [alertColor, setAlertColor] = React.useState<AlertColor>('error');
  const [isMainInn, setIsMainInn] = React.useState<string>('7716852062');

  React.useEffect(() => {
    void fetchOrganizationData(isMainInn, setInitialData, setIsMessage, setAlertColor);
  }, [isMainInn]);

  const handleRegistrationSuccess = (result: ApiResult): void => {
    console.log(result);
    handleApiResult(result, setInitialData, setIsMessage, setAlertColor, isMainInn);
  };

  return (
    <Layout>
      <GuestGuard>
        <Box>
          {initialData?.inn === isMainInn ? (
            <CheckOrganisation initialData={initialData} />
          ) : (
            <SignUpFormOrganization
              isMain={isMain}
              onRegistrationSuccess={handleRegistrationSuccess}
              setIsMessage={setIsMessage}
              setAlertColor={setAlertColor}
            />
          )}
          {isMessage ? <Alert sx={{ marginTop: 2 }} color={alertColor}>{isMessage}</Alert> : null}
        </Box>
      </GuestGuard>
    </Layout>
  );
}

export default Page;
