import React, { useState, useCallback } from 'react';
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
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { Spinner } from "@phosphor-icons/react";
import { type SensorInfo } from "@/types/sensor";
import {type AlertColor} from "@mui/material";

// Define the props for the component
interface SignUpFormAddLogProps {
  dataOfSensor: SensorInfo;
  alertModalColor: AlertColor;// Adjust this to match the allowed values for the color prop of Alert
  updateLogsInfoForSensor: (values: FormValues) => void;
  modalMessage: string;
}

// Define the form values using Zod schema
const schema = zod.object({
  sensor_id: zod.string(),
  passport_information: zod.string().min(1, { message: 'Ввод информации о паспорте обязателен' }),
  verification_information: zod.string().min(1, { message: 'Ввод информации о поверке обязательна' }),
  warranty_information: zod.string().min(1, { message: 'Ввод информации о гарантии обязательна' }),
  sensorOperationLogNotation: zod.string(),
});

// Define the form values type
type FormValues = zod.infer<typeof schema>;

export const SignUpFormAddLog: React.FC<SignUpFormAddLogProps> = ({
                                                                    dataOfSensor,
                                                                    alertModalColor,
                                                                    updateLogsInfoForSensor,
                                                                    modalMessage,
                                                                  }) => {
  const [isPending, setIsPending] = useState<boolean>(false);

  // Define default values for the form
  const defaultValues: FormValues = {
    sensor_id: dataOfSensor?.id || '',
    passport_information: dataOfSensor?.sensor_operation_log[0]?.passport_information || '',
    verification_information: dataOfSensor?.sensor_operation_log[0]?.verification_information || '',
    warranty_information: dataOfSensor?.sensor_operation_log[0]?.warranty_information || '',
    sensorOperationLogNotation: dataOfSensor?.sensor_operation_log[0]?.sensorOperationLogNotation || ''
  };

  const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const onSubmit = useCallback(async (values: FormValues): Promise<void> => {
    setIsPending(true);
    await updateLogsInfoForSensor(values);
    setIsPending(false);
  }, [updateLogsInfoForSensor]);

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h5">
          Добавление данных журналов для датчика:
          <br />
          {dataOfSensor.sensor_type} | {dataOfSensor.designation} | {dataOfSensor.model}
        </Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="passport_information"
            render={({ field }) => (
              <FormControl error={Boolean(errors.passport_information)}>
                <InputLabel>Введите информацию о паспорте</InputLabel>
                <OutlinedInput {...field} label="Введите информацию о паспорте" />
                {errors.passport_information ? (
                  <FormHelperText>{errors.passport_information.message}</FormHelperText>
                ) : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="verification_information"
            render={({ field }) => (
              <FormControl error={Boolean(errors.verification_information)}>
                <InputLabel>Введите информацию о поверке</InputLabel>
                <OutlinedInput {...field} label="Введите информацию о поверке" />
                {errors.verification_information ? (
                  <FormHelperText>{errors.verification_information.message}</FormHelperText>
                ) : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="warranty_information"
            render={({ field }) => (
              <FormControl error={Boolean(errors.warranty_information)}>
                <InputLabel>Введите информацию о гарантии</InputLabel>
                <OutlinedInput {...field} label="Введите информацию о гарантии" />
                {errors.warranty_information ? (
                  <FormHelperText>{errors.warranty_information.message}</FormHelperText>
                ) : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="sensorOperationLogNotation"
            render={({ field }) => (
              <FormControl error={Boolean(errors.sensorOperationLogNotation)}>
                <InputLabel>Введите примечание</InputLabel>
                <OutlinedInput {...field} label="Введите примечание" />
                {errors.sensorOperationLogNotation ? (
                  <FormHelperText>{errors.sensorOperationLogNotation.message}</FormHelperText>
                ) : null}
              </FormControl>
            )}
          />
          <Button disabled={isPending} type="submit" variant="contained" sx={{ marginTop: 2 }}>
            {isPending ? (
              <Spinner />
            ) : (
              <Box>Зарегистрировать</Box>
            )}
          </Button>
          {modalMessage ? <Alert color={alertModalColor}>{modalMessage}</Alert> : null}
        </Stack>
      </form>
    </Stack>
  );
};
