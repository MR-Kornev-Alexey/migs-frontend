'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import {useRouter} from 'next/navigation';
import {zodResolver} from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {Eye as EyeIcon} from '@phosphor-icons/react/dist/ssr/Eye';
import {EyeSlash as EyeSlashIcon} from '@phosphor-icons/react/dist/ssr/EyeSlash';
import {Controller, useForm} from 'react-hook-form';
import {z as zod} from 'zod';

import {paths} from '@/paths';
import {authClient} from '@/lib/auth/client';
import {useUser} from '@/hooks/use-user';
import Box from "@mui/material/Box";
import {fetchOrganizationData} from "@/lib/common-api/fetch-data-check-main";
import {type Organization} from "@/types/result-api";
import {type AlertColor} from "@mui/material";
import {customersClient} from "@/components/dashboard/customers/customers-client";

// Define the schema for form validation using Zod
const schema = zod.object({
  email: zod.string().min(1, {message: 'Email is required'}).email(),
  password: zod.string().min(1, {message: 'Password is required'}),
});

type Values = zod.infer<typeof schema>;

// Default form values
const defaultValues = {email: '', password: ''};

export function SignInForm(): React.JSX.Element {
  const router = useRouter();
  const {checkSession} = useUser();

  // Define state variables
  const [showPassword, setShowPassword] = React.useState(false);
  const [isPending, setIsPending] = React.useState(false);
  const [isHaveSupervisor, setIsHaveSupervisor] = React.useState(false);
  const [isReady, setIsReady] = React.useState(false);
  const [initialData, setInitialData] = React.useState<Organization | null>(null);
  const [isMessage, setIsMessage] = React.useState<string>('');
  const [alertColor, setAlertColor] = React.useState<AlertColor>('error');
  const isMainInn = '7716852062';

  // React Hook Form setup with validation
  const {
    control,
    handleSubmit,
    setError,
    formState: {errors},
  } = useForm<Values>({defaultValues, resolver: zodResolver(schema)});

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchOrganizationData(isMainInn, setInitialData, setIsMessage, setAlertColor);
      } catch (error) {
        setIsMessage(`Error fetching organization data: ${error}`);
      }
    };

    const checkRole = async () => {
      try {
        const responseCheckRole = await customersClient.findRoleCustomer();

        setIsHaveSupervisor(responseCheckRole?.data?.statusCode === 200);
      } catch (error) {
        setIsMessage(`Ошибка проверки роли супервизора: ${error}`);
        setIsHaveSupervisor(false);
      }
    };

    const initialize = async () => {
      await fetchData();
      await checkRole();

      if (initialData?.inn === isMainInn && isHaveSupervisor) {
        setIsReady(true);
      }
    };

    initialize();
  }, [initialData?.inn, isHaveSupervisor, isMainInn]);

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);

      const {error} = await authClient.signInWithPassword(values);

      if (error) {
        setError('root', {type: 'server', message: error});
        setIsPending(false);
        return;
      }

      // Refresh the auth state
      await checkSession?.();

      // Refresh the router
      router.refresh();
    },
    [checkSession, router, setError]
  );

  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        {!isReady && (
          <Typography variant="h4" sx={{marginBottom: 2}}>
            Для первичной регистрации необходимо
          </Typography>
        )}
        {initialData?.inn !== isMainInn && (
          <Box sx={{marginBottom: 2}}>
            <Typography color="text.secondary" variant="h5">
              Внести в базу данных основную организацию
            </Typography>
            <Link component={RouterLink} href={paths.auth.inputMainOrganization} underline="hover" variant="h5">
              Перейти &gt;&gt;
            </Link>
          </Box>
        )}
        {!isHaveSupervisor && (
          <Box>
            <Typography color="text.secondary" variant="h5">
              Внести в базу данных супервайзера
            </Typography>
            <Link component={RouterLink} href={paths.auth.signUp} underline="hover" variant="h5">
              Перейти &gt;&gt;
            </Link>
          </Box>
        )}
      </Stack>
      {isReady ? <Stack>
          <Typography variant="h4" sx={{marginBottom: 2}}>
            Вход в систему
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <Controller
                control={control}
                name="email"
                render={({field}) => (
                  <FormControl error={Boolean(errors.email)}>
                    <InputLabel>Email address</InputLabel>
                    <OutlinedInput {...field} label="Email address" type="email"/>
                    {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="password"
                render={({field}) => (
                  <FormControl error={Boolean(errors.password)}>
                    <InputLabel>Password</InputLabel>
                    <OutlinedInput
                      {...field}
                      endAdornment={
                        showPassword ? (
                          <EyeIcon
                            cursor="pointer"
                            fontSize="var(--icon-fontSize-md)"
                            onClick={() => { setShowPassword(false); }}
                          />
                        ) : (
                          <EyeSlashIcon
                            cursor="pointer"
                            fontSize="var(--icon-fontSize-md)"
                            onClick={() => { setShowPassword(true); }}
                          />
                        )
                      }
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                    />
                    {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
                  </FormControl>
                )}
              />
              {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
              <Button disabled={isPending} type="submit" variant="contained">
                Войти
              </Button>
            </Stack>
          </form>
        </Stack> : null
      }
      {
        isMessage ? <Alert sx={{marginTop: 2}} color={alertColor}>{isMessage}</Alert> : null
      }
    </Stack>
  )
    ;
}
