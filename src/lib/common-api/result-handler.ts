import { type Organization } from '@/types/result-api';
import { type AlertColor } from '@mui/material';
import type React from "react";

// Define the type for the set state functions
type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export function handleApiResult(
  result: any,  // Replace 'any' with your actual result type if available
  setInitialData: SetState<Organization | null>,
  setIsMessage: SetState<string>,
  setAlertColor: SetState<AlertColor>,
  isMainInn: string
): void {
  switch (result?.statusCode) {
    case 200:
      if (result?.organization?.inn === isMainInn) {
        setInitialData(result?.organization);
      }
      setAlertColor('success');
      setIsMessage(result?.message ?? '');
      setTimeout(() => {
        setIsMessage('');
      }, 2000);
      break;
    case 400:
    case 500:
      setAlertColor('error');
      setIsMessage(result?.message ?? '');
      setInitialData(null);
      break;
    default:
      setAlertColor('error');
      setIsMessage(result?.error?.message ?? 'Ошибка сети');
      setInitialData(null);
      break;
  }
}
