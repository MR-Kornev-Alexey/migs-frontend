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
import Spinner from "@/components/animated-icon/spinner";

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
  onClose: () => void;
}

export function SignUpFormOrganization({
                                         isMain,
                                         onRegistrationSuccess,
                                         setIsMessage,
                                         setAlertColor,
                                         onClose,
                                       }: SignUpFormOrganizationProps): React.JSX.Element {
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const [isModalMessage, setIsModalMessage] = React.useState<any>('');
  const [alertModalColor, setModalAlertColor] = React.useState<AlertColor>('error');
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
      if (result?.statusCode === 200) {
        setIsPending(false);
        onRegistrationSuccess(result);
        setIsMessage(result?.message ?? ''); // Provide a default empty string
        setAlertColor('success');
        onClose()
        setTimeout(() => {
          setIsMessage('');
        }, 2500)
      } else if (result?.statusCode === 400){
        setIsModalMessage(result?.message);
        setModalAlertColor('error');
        setIsPending(false);
        setTimeout(() => {
          setIsModalMessage('');
        }, 2500)
      }
      else {
        setIsModalMessage(result?.message);
        setModalAlertColor('error');
        setIsPending(false);
        setTimeout(() => {
          setIsModalMessage('');
        }, 2500)
      }
    } catch (error) {
      setIsModalMessage(`Произошла ошибка:${  (error as Error).message}`);
      setModalAlertColor('error');
      setIsPending(false);
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
              <Spinner />
            ) : (
              <Box>Зарегистрировать</Box>
            )}
          </Button>
        </Stack>
      </form>
      {isModalMessage ? <Alert color={alertModalColor}>{isModalMessage}</Alert> : null}
    </Stack>
  );
}
