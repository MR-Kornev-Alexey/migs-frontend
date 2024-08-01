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
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { organizationClient } from '@/lib/organizations/organization-client';

interface SignUpFormOrganizationProps {
  isMain: boolean;
  closeModal: (shouldClose: boolean) => void;  // Ensure closeModal is defined here
  onRegistrationSuccess: (result: any) => void;
}


export function SignUpFormOrganization({ isMain, closeModal, onRegistrationSuccess }: SignUpFormOrganizationProps): React.JSX.Element {
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const [isMessage, setIsMessage] = React.useState<string>('');
  const [alertColor, setAlertColor] = React.useState<AlertColor>('error');
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
      .min(12, { message: 'Ввод должен содержать  12 символов' })
      .regex(phoneRegex, { message: 'Ввод должен содержать  +7 и 10 цифр' }),
    organizationEmail: zod.string().min(1, { message: 'Ввод email обязателен' }).email(),
  });

  type Values = zod.infer<typeof schema>;
  const defaultValues = {
    name: 'ООО «НИИ МИГС»',
    inn: '7716852062',
    address: '129344 г. Москва, Енисейская ул., д.1, стр. 1, этаж 2, пом.255',
    directorName: 'Курыпов Алексей Александрович',
    organizationPhone: '+74954192807',
    organizationEmail: 'info@nii-migs.ru',
  } satisfies Values;

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);
      let result;
      if (isMain) {
        result = await organizationClient.initMainOrganization(values);
      } else {
        result = await organizationClient.createNewOrganization(values);
      }
      if (result?.data?.statusCode === 200) {
        setIsPending(false);
        setAlertColor('success');
        setIsMessage(result?.data?.message);
        setTimeout(() => {
          // обновленные данные в таблицу
          onRegistrationSuccess(result);
          if (!isMain) {
            closeModal(false);
          }
        }, 2000);
      }
      if (result?.data?.statusCode === 400) {
        // console.log("result --- ", result?.data);
        setIsPending(false);
        setIsMessage(result?.data?.message);
        setAlertColor('error');
      }
      // Проверить наличие ошибки
      if (result?.error) {
        setIsPending(false);
        setIsMessage(result?.data?.message);
        setAlertColor('error');
        
      }
    },
    [setError]
  );
  return (
    <Stack spacing={3}>
      {isMain ? (
        <Typography variant="h4">Добавление главной организации</Typography>
      ) : (
        <Typography variant="h4">Добавление новой организации</Typography>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <FormControl error={Boolean(errors.name)}>
                <InputLabel>Введите название</InputLabel>
                <OutlinedInput {...field} label="Введите название" />
                {errors.name ? <FormHelperText>{errors.name.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="inn"
            render={({ field }) => (
              <FormControl error={Boolean(errors.inn)}>
                <InputLabel>Введите ИНН</InputLabel>
                <OutlinedInput {...field} label="Ввод ИНН" />
                {errors.inn ? <FormHelperText>{errors.inn.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="address"
            render={({ field }) => (
              <FormControl error={Boolean(errors.address)}>
                <InputLabel>Адрес организации</InputLabel>
                <OutlinedInput {...field} label="Введите адрес" />
                {errors.address ? <FormHelperText>{errors.address.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="directorName"
            render={({ field }) => (
              <FormControl error={Boolean(errors.directorName)}>
                <InputLabel>Имя руководителя</InputLabel>
                <OutlinedInput {...field} label="Имя руководителя" />
                {errors.directorName ? <FormHelperText>{errors.directorName.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="organizationPhone"
            render={({ field }) => (
              <FormControl error={Boolean(errors.organizationPhone)}>
                <InputLabel>Телефон организации</InputLabel>
                <OutlinedInput {...field} label="Телефон организации" />
                {errors.organizationPhone ? <FormHelperText>{errors.organizationPhone.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="organizationEmail"
            render={({ field }) => (
              <FormControl error={Boolean(errors.organizationEmail)}>
                <InputLabel>Email организации</InputLabel>
                <OutlinedInput {...field} label="Email организации" type="email" />
                {errors.organizationEmail ? <FormHelperText>{errors.organizationEmail.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
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
          {isMessage ? <Alert color={alertColor}>{isMessage}</Alert> : null}
        </Stack>
      </form>
    </Stack>
  );
}
