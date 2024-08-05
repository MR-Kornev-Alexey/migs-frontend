import * as React from 'react';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { customersClient } from '@/lib/customers/customers-client';
import type { AlertColor } from '@mui/material';
import { ApiResult, Organization } from '@/types/result-api';
import { organizationClient } from '@/lib/organizations/organization-client';

// Define the schema
const schema = zod.object({
  name: zod.string().min(1, { message: 'Ввод username обязателен' }),
  email: zod.string().min(1, { message: 'Ввод email обязателен' }).email(),
  role: zod.string().min(1, { message: 'Выбор пользователя обязателен' }),
  password: zod.string().min(8, { message: 'Минимальное количество 8 знаков' }),
  organization_id: zod.string().min(1, { message: 'Выбор организации обязателен' }),
  registration_status: zod.string(),
});

type Values = zod.infer<typeof schema>;
const defaultValues = {
  name: 'dimas',
  email: 'dimas@mail.ru',
  password: '',
  organization_id: '',
  registration_status: 'NOT_COMPLETED',
  role: 'customer',
} satisfies Values;

// Define prop types
interface SignUpFormNewCustomerProps {
  onRegistrationCustomerSuccess: (data: any) => void; // Adjust the type based on what data you expect
  closeModal: (shouldClose: boolean) => void;
}

export function SignUpFormNewCustomer({ onRegistrationCustomerSuccess, closeModal }: SignUpFormNewCustomerProps): React.JSX.Element {
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const [isMessage, setIsMessage] = React.useState<string>('');
  const [alertColor, setAlertColor] = React.useState<AlertColor>('error');
  const [isAllOrganizations, setAllOrganizations] = React.useState<Organization[]>([]);

  useEffect(() => {
    const fetchAllOrganization = async () => {
      try {
        const result: ApiResult = await organizationClient.getAllOrganization();

        if (result?.statusCode === 200) {
          console.log(result);
          setAlertColor('success');
          setIsMessage('Успешное получение данных предприятий');
          setTimeout(() => {
            setIsMessage('');
          }, 2000);
          setAllOrganizations(result?.allOrganizations);
        } else {
          setAlertColor('error');
          setIsMessage(result?.data?.message || 'Произошла ошибка получения данных орагнизаций');
        }
      } catch (error) {
        console.error('Ошибка при регистрации:', error);
        setAlertColor('error');
        setIsMessage('Произошла ошибка');
      }
    };
    fetchAllOrganization();
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(async (values: Values): Promise<void> => {
    setIsPending(true);
    setIsMessage('');
    const result: any = await customersClient.createNewCustomer(values);

    switch (result?.data?.statusCode) {
      case 200:
        setAlertColor('success');
        setIsMessage(result?.data?.message);
        onRegistrationCustomerSuccess(result?.data?.allUsers);
        setTimeout(() => {
          closeModal(false);
        }, 3000);
        break;
      case 400:
      case 500:
        setAlertColor('error');
        setIsMessage(result?.data?.message);
        break;
      default:
        setAlertColor('error');
        setIsMessage(result?.error?.message || 'Произошла ошибка');
        break;
    }
    setIsPending(false);
  }, [onRegistrationCustomerSuccess, closeModal]);

  const organizationOptions = isAllOrganizations.map((org: Organization) => ({
    value: org.id,
    label: org.name,
  }));

  const choiceOfRole = [
    { label: 'Пользователь', value: 'customer' },
    { label: 'Диспетчер', value: 'dispatcher' },
    { label: 'Администратор', value: 'admin' },
  ];

  return (
    <Stack spacing={3}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <FormControl error={Boolean(errors.name)}>
                <InputLabel>Введите username</InputLabel>
                <OutlinedInput {...field} label="Введите username" />
                {errors.name ? <FormHelperText>{errors.name.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="role"
            defaultValue="customer"
            render={({ field }) => (
              <FormControl error={Boolean(errors.role)}>
                <InputLabel id="select-label">Выберите организацию</InputLabel>
                <Select {...field} labelId="select-label" label="Выберите вариант">
                  <MenuItem disabled value="-1">
                    Выберите статус
                  </MenuItem>
                  {choiceOfRole.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.role ? <FormHelperText>{errors.role.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormControl error={Boolean(errors.email)}>
                <InputLabel>Email</InputLabel>
                <OutlinedInput {...field} label="Email" type="email" />
                {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)}>
                <InputLabel>Пароль</InputLabel>
                <OutlinedInput {...field} label="Пароль" type="password" />
                {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="organization_id"
            defaultValue="-1"
            render={({ field }) => (
              <FormControl error={Boolean(errors.organization_id)}>
                <InputLabel id="select-label">Выберите организацию</InputLabel>
                <Select {...field} labelId="select-label" label="Выберите вариант">
                  <MenuItem disabled value="-1">
                    Выберите организацию
                  </MenuItem>
                  {organizationOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.organization_id ? <FormHelperText>{errors.organization_id.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Button disabled={isPending} type="submit" variant="contained" sx={{ my: 1 }}>
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
            ) : (
              <Box>Зарегистрировать</Box>
            )}
          </Button>
          {isMessage ? <Alert sx={{ marginTop: 2 }} color={alertColor}>{isMessage}</Alert> : null}
        </Stack>
      </form>
    </Stack>
  );
}
