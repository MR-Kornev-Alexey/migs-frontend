'use client';

import * as React from 'react';
import MeasurementData from "@/components/dashboard/additional-data-sensor/unit-of-measurement"; // Renamed import
import { zodResolver } from '@hookform/resolvers/zod';
import {
  MenuItem,
  Select,
  Alert,
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography, type AlertColor
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { Spinner } from "@phosphor-icons/react";
import { type SensorInfo } from "@/types/sensor";

interface Props {
  sensorMain: SensorInfo;
  successOfResult: (value: Values) => void;
  isMessageAlertModal: string;
  isAlertModalColor: AlertColor;
}


const numericSingleDotOrCommaRegex = /^-?[0-9]+([,.][0-9]{1,2})?$/;

const schema = zod.object({
  sensor_id: zod.string(),
  factory_number: zod.string().min(1, { message: 'Ввод заводского номера обязателен' }),
  unit_of_measurement: zod.string().min(1, { message: 'Ввод единиц измерения обязателен' }),
  installation_location: zod.string().min(1, { message: 'Ввод места установки обязателен' }),
  coefficient: zod.string().regex(numericSingleDotOrCommaRegex, {
    message: 'Ввод может содержать только цифры и одну точку или запятую для десятичных цифр, с не более чем двумя цифрами после них',
  }),
  additionalSensorInfoNotation: zod.string(),
});

type Values = zod.infer<typeof schema>;

export function SignUpFormAddDataSensor({
                                          sensorMain,
                                          successOfResult,
                                          isMessageAlertModal,
                                          isAlertModalColor
                                        }: Props): React.JSX.Element {
  const [isPending, setIsPending] = React.useState<boolean>(false);

  const defaultValues: Values = {
    sensor_id: sensorMain.id,
    factory_number: sensorMain.additional_sensor_info[0]?.factory_number || '',
    unit_of_measurement: '',
    installation_location: sensorMain.additional_sensor_info[0]?.installation_location || '',
    coefficient: sensorMain.additional_sensor_info[0]?.coefficient?.toString() || '',
    additionalSensorInfoNotation: sensorMain.additional_sensor_info[0]?.additionalSensorInfoNotation || '',
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(async (values: Values): Promise<void> => {
    setIsPending(true);
    successOfResult(values);
    console.log(values);
    setIsPending(false);
  }, [successOfResult]);

  const getUnitValues = () => {
    // Iterate through each key in the MeasurementData object
    for (const key in MeasurementData) {
      // Ensure key is a valid property and has sensors
      if (Object.prototype.hasOwnProperty.call(MeasurementData, key)) {
        // Find the sensor that matches both the sensor type and model
        const selectedSensor: any = MeasurementData[key].find(
          (sensor:any) =>
            sensor.type === sensorMain.sensor_type && sensor.model === sensorMain.model
        );
        // If the sensor is found, return the mapping of unit names and values
        if (selectedSensor) {
          return selectedSensor.unitNames.map((name:any, index:any) => ({
            name_unit: name,
            value: selectedSensor.unitValues[index],
          }));
        }
      }
    }
    return [];
  };

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h5">
          Добавление дополнительных данных для датчика: {sensorMain.sensor_type} | {sensorMain.model} | {sensorMain.designation}
        </Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="factory_number"
            render={({ field }) => (
              <FormControl error={Boolean(errors.factory_number)}>
                <InputLabel>Введите заводской номер</InputLabel>
                <OutlinedInput {...field} label="Введите заводской номер" />
                {errors.factory_number ? <FormHelperText>{errors.factory_number.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="unit_of_measurement"
            render={({ field }) => (
              <FormControl error={Boolean(errors.unit_of_measurement)} sx={{ width: '96%' }}>
                <InputLabel>Введите единицу измерения</InputLabel>
                <Select {...field} label="Введите единицу измерения">
                  {getUnitValues().map((unit:any, index:number) => (
                    <MenuItem key={index} value={unit.value}>
                      {unit.name_unit}
                    </MenuItem>
                  ))}
                </Select>
                {errors.unit_of_measurement ? <FormHelperText>{errors.unit_of_measurement.message}</FormHelperText> : null}
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="installation_location"
            render={({ field }) => (
              <FormControl error={Boolean(errors.installation_location)}>
                <InputLabel>Введите место установки</InputLabel>
                <OutlinedInput {...field} label="Введите место установки" />
                {errors.installation_location ? <FormHelperText>{errors.installation_location.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="coefficient"
            render={({ field }) => (
              <FormControl error={Boolean(errors.coefficient)}>
                <InputLabel>Введите коэффициент</InputLabel>
                <OutlinedInput {...field} label="Введите коэффициент" />
                {errors.coefficient ? <FormHelperText>{errors.coefficient.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="additionalSensorInfoNotation"
            render={({ field }) => (
              <FormControl error={Boolean(errors.additionalSensorInfoNotation)}>
                <InputLabel>Введите примечание</InputLabel>
                <OutlinedInput {...field} label="Введите примечание" />
                {errors.additionalSensorInfoNotation ? <FormHelperText>{errors.additionalSensorInfoNotation.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Button disabled={isPending} type="submit" variant="contained" sx={{ marginTop: 2 }}>
            {isPending ? <Spinner /> : <Box>Сохранить</Box>}
          </Button>
        </Stack>
      </form>
      {isMessageAlertModal ? <Alert color={isAlertModalColor}>{isMessageAlertModal}</Alert> : null}
    </Stack>
  );
}
