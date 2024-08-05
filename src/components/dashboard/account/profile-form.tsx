'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { Controller, useForm, FieldErrors } from 'react-hook-form';
import { z as zod } from 'zod';

import { customersClient } from '@/lib/customers/customers-client';
import { AlertColor } from '@mui/material';

// Regex definitions for validation
const CyrillicLettersRegex = /^[а-яА-Я\s]+$/;
const phoneRegex = /^\+7\d{10}$/;
const telegramRegex = /^@.*/;

// Define the schema for form validation using Zod
const schema = zod.object({
  firstName: zod
    .string()
    .min(1, { message: 'Ввод имени обязателен' })
    .regex(CyrillicLettersRegex, { message: 'Ввод только букв кириллицы' }),
  surName: zod
    .string()
    .min(1, { message: 'Ввод фамилии обязателен' })
    .regex(CyrillicLettersRegex, { message: 'Ввод только букв кириллицы' }),
  telegram: zod
    .string()
    .min(1, { message: 'Ввод аккаунт телеграма обязателен' })
    .regex(telegramRegex, { message: 'Аккаунт должен начинаться с @...' }),
  position: zod.string().min(1, { message: 'Ввод должности обязателен' }),
  phone: zod
    .string()
    .min(12, { message: 'Ввод должен содержать 12 символов' })
    .regex(phoneRegex, { message: 'Ввод должен содержать +7 и 10 цифр' }),
});

// Define a type for the form data
type FormData = zod.infer<typeof schema> & { user_id: string; flagEdit: boolean };

// Define a type for the default values
type DefaultValues = {
  user_id: string;
  firstName: string;
  surName: string;
  telegram: string;
  position: string;
  phone: string;
  flagEdit: boolean;
};

// Define the props type for the ProfileForm component
interface ProfileFormProps {
  changeData: () => void;
  flagEdit: boolean;
  receivedData: {
    additionalUserInfo: Array<{
      firstName: string;
      surName: string;
      telegram: string;
      position: string;
      phone: string;
    }>;
  };
  successRecorded: (data: any) => void;
}

// ProfileForm component with types
export function ProfileForm({ flagEdit, receivedData, successRecorded }: ProfileFormProps): React.JSX.Element {
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const [isMessage, setIsMessage] = React.useState<string>('');
  const [alertColor, setAlertColor] = React.useState<AlertColor>('error');

  // Set default values based on receivedData or use fallback values
  const userData = receivedData?.additionalUserInfo[0];
  const defaultValues: DefaultValues = userData
    ? {
      user_id: '',
      firstName: userData.firstName,
      surName: userData.surName,
      telegram: userData.telegram,
      position: userData.position,
      phone: userData.phone,
      flagEdit: false,
    }
    : {
      user_id: '',
      firstName: 'Elena',
      surName: 'Petrova',
      telegram: '@Petrova',
      position: 'Manager',
      phone: '+79809090101',
      flagEdit: false,
    };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const onSubmit = React.useCallback(async (values: FormData): Promise<void> => {
    const dataUser = localStorage.getItem('custom-auth-token');
    let userId = '';

    // Extract user ID from local storage if available
    if (dataUser !== null) {
      userId = JSON.parse(dataUser).id;
    }

    setIsPending(true);

    // Prepare updated values with user ID and flagEdit
    const updatedValues = { ...values, user_id: userId, flagEdit };

    try {
      // Call the API client to submit data
      const result: any = await customersClient.initSignAdditionalData(updatedValues);
      switch (result?.data?.statusCode) {
        case 200:
          setAlertColor('success');
          setIsMessage(result?.data?.message);
          setTimeout(() => {
            successRecorded(result?.data);
            setIsMessage('');
          }, 2000);
          break;
        case 400:
        case 500:
          setAlertColor('error');
          setIsMessage(result?.data?.message);
          setTimeout(() => {
            setIsMessage('');
          }, 3000);
          break;
        default:
          setAlertColor('error');
          setIsMessage(result?.error?.message || 'Произошла ошибка обработки данных');
          setTimeout(() => {
            setIsMessage('');
          }, 3000);
          break;
      }
    } catch (error) {
      setAlertColor('error');
      setIsMessage('Произошла ошибка обработки данных');
      setTimeout(() => {
        setIsMessage('');
      }, 3000);
      console.error('Error submitting form data:', error);
    } finally {
      setIsPending(false);
    }
  }, []);

  return (
    <Stack spacing={3} display="flex" justifyContent="center" alignItems="center">
      <Box>
        <Typography variant="body1">Пожалуйста заполните форму</Typography>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid md={6} xs={12} display="flex" justifyContent="center" alignItems="center">
            <Controller
              control={control}
              name="firstName"
              render={({ field }) => (
                <FormControl error={Boolean(errors.firstName)}>
                  <InputLabel>Введите имя</InputLabel>
                  <OutlinedInput {...field} label="Введите имя" />
                  {errors.firstName ? <FormHelperText>{errors.firstName.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
          </Grid>
          <Grid md={6} xs={12} display="flex" justifyContent="center" alignItems="center">
            <Controller
              control={control}
              name="surName"
              render={({ field }) => (
                <FormControl error={Boolean(errors.surName)}>
                  <InputLabel>Введите фамилию</InputLabel>
                  <OutlinedInput {...field} label="Введите фамилию" />
                  {errors.surName ? <FormHelperText>{errors.surName.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
          </Grid>
          <Grid md={6} xs={12} display="flex" justifyContent="center" alignItems="center">
            <Controller
              control={control}
              name="telegram"
              render={({ field }) => (
                <FormControl error={Boolean(errors.telegram)}>
                  <InputLabel>Телеграм</InputLabel>
                  <OutlinedInput {...field} label="Телеграм" />
                  {errors.telegram ? <FormHelperText>{errors.telegram.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
          </Grid>
          <Grid md={6} xs={12} display="flex" justifyContent="center" alignItems="center">
            <Controller
              control={control}
              name="phone"
              render={({ field }) => (
                <FormControl error={Boolean(errors.phone)}>
                  <InputLabel>Номер телефона</InputLabel>
                  <OutlinedInput {...field} label="Номер телефона" type="phone" />
                  {errors.phone ? <FormHelperText>{errors.phone.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
          </Grid>
          <Grid md={6} xs={12} display="flex" justifyContent="center" alignItems="center">
            <Controller
              control={control}
              name="position"
              render={({ field }) => (
                <FormControl error={Boolean(errors.position)}>
                  <InputLabel>Должность</InputLabel>
                  <OutlinedInput {...field} label="Должность" />
                  {errors.position ? <FormHelperText>{errors.position.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
          </Grid>
          {errors.root && <Alert color="error">{errors.root.message}</Alert>}
          {isMessage && <Alert color={alertColor}>{isMessage}</Alert>}
          <Grid md={12} xs={12} display="flex" justifyContent="center" alignItems="center">
            <Button disabled={isPending} type="submit" variant="contained">
              {isPending ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
                    opacity={0.25}
                  ></path>
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
                    ></animateTransform>
                  </path>
                </svg>
              ) : flagEdit ? (
                <Box>Сохранить данные</Box>
              ) : (
                <Box>Изменить данные</Box>
              )}
            </Button>
          </Grid>
        </Grid>
      </form>
      {isMessage && <Alert color={alertColor}>{isMessage}</Alert>}
    </Stack>
  );
}
