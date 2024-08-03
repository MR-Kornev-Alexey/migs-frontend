// src/utils/fetchData.ts

import { type AlertColor } from '@mui/material';
import { type Organization } from '@/types/result-api';
import { organizationClient } from '@/lib/organizations/organization-client';
import { handleApiResult } from '@/lib/common-api/result-handler';
import type React from "react";

// Define the type for the set state functions
type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export async function fetchOrganizationData(
  isMainInn: string,
  setInitialData: SetState<Organization | null>,
  setIsMessage: SetState<string>,
  setAlertColor: SetState<AlertColor>
): Promise<void> {
  try {
    const requestData: { inn: string } = { inn: isMainInn };
    const [result] = await Promise.all([
      organizationClient.checkOrganization(requestData),
    ]);
    handleApiResult(result, setInitialData, setIsMessage, setAlertColor, isMainInn);
  } catch (error) {
    setAlertColor('error');
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    setIsMessage(`Ошибка проверки данных: ${errorMessage}`);
  }
}
