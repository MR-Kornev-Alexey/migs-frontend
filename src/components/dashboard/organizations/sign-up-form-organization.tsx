'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, type AlertColor } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { z as zod } from 'zod';

import { organizationClient } from '@/components/dashboard/organizations/organization-client';
import type { ApiResult } from '@/types/result-api';

interface SignUpFormValues {
  name: string;
  inn: string;
  address: string;
  directorName: string;
  organizationPhone: string;
  organizationEmail: string;
}

interface SignUpFormOrganizationProps {
  isMain: boolean;
  onRegistrationSuccess: (result: ApiResult) => void;
  setIsMessage: (message: string) => void;
  setAlertColor: (color: AlertColor) => void;
}

export function SignUpFormOrganization({
                                         isMain,
                                         onRegistrationSuccess,
                                         setIsMessage,
                                         setAlertColor,
                                       }: SignUpFormOrganizationProps): React.JSX.Element {
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const numberRegex = /^(?:\d{10}|\d{12})$/;
  const phoneRegex = /^\+7\d{10}$/;

  const schema = zod.object({
    name: zod.string().min(1, { message: 'Ввод имени обязателен' }),
    inn: zod
      .string()
      .min(10, { message: 'Ввод должен содержать не менее 10 цифр' })
      .regex(numberRegex, { message: 'Ввод должен содержать ровно 10 или 12 цифр' }),
    address: zod.string().min(1, { message: 'Ввод адреса организации обязателен' }),
    directorName: zod.string().min(1, { message: 'Ввод руководителя организации обязателен' }),
    organizationPhone: zod
      .string()
      .min(12, { message: 'Ввод должен содержать 12 символов' })
      .regex(phoneRegex, { message: 'Ввод должен содержать +7 и 10 цифр' }),
    organizationEmail: zod.string().min(1, { message: 'Ввод email обязателен' }).email(),
  });

  const defaultValues: SignUpFormValues = {
    name: 'ООО «НИИ МИГС»',
    inn: '7716852062',
    address: '129344 г. Москва, Енисейская ул., д.1, стр. 1, этаж 2, пом.255',
    directorName: 'Курыпов Алексей Александрович',
    organizationPhone: '+74954192807',
    organizationEmail: 'info@nii-migs.ru',
  };

  const { control, handleSubmit, setError, formState: { errors } } = useForm<SignUpFormValues>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<SignUpFormValues> = React.useCallback(async (values: SignUpFormValues) => {
    setIsPending(true);
    let result: ApiResult;
    try {
      if (isMain) {
        result = await organizationClient.initMainOrganization(values);
      } else {
        result = await organizationClient.createNewOrganization(values);
      }
      if (result.statusCode === 200) {
        setIsPending(false);
        onRegistrationSuccess(result);
      } else {
        setIsMessage('Что пошло не так, попробуйте перегрузться');
        setAlertColor('error');
      }
    } catch (error) {
      console.error('Произошла ошибка:', (error as Error).message);
      setIsPending(false);
      setIsMessage('Произошла ошибка');
      setAlertColor('error');
    }
  }, [isMain, onRegistrationSuccess, setIsMessage, setAlertColor]);

  const fieldNames: (keyof SignUpFormValues)[] = [
    'name',
    'inn',
    'address',
    'directorName',
    'organizationPhone',
    'organizationEmail'
  ];

  return (
    <Stack spacing={3}>
      <Typography variant="h4">
        {isMain ? 'Добавление главной организации' : 'Добавление новой организации'}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          {fieldNames.map((field) => (
            <Controller
              key={field}
              control={control}
              name={field}
              render={({ field: { name, ...restField } }) => (
                <FormControl error={Boolean(errors[field])}>
                  <InputLabel>{`Введите ${field}`}</InputLabel>
                  <OutlinedInput {...restField} label={`Введите ${field}`} />
                  {errors[field] ? <FormHelperText>{errors[field]?.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
          ))}
          <Button disabled={isPending} type="submit" variant="contained" sx={{ marginTop: 2 }}>
            {isPending ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
                  opacity={0.25}
                />
                <path
                  fill="currentColor"
                  d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z"
                >
                  <animateTransform
                    attributeName="transform"
                    dur="0.75s"
                    repeatCount="indefinite"
                    type="rotate"
                    values="0 12 12;360 12 12"
                  />
                </path>
              </svg>
            ) : (
              <Box>Зарегистрировать</Box>
            )}
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
