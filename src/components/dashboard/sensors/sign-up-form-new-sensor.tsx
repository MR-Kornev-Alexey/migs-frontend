import * as React from 'react';
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

import calculateRequestCode from '@/lib/calculate/calculate-request-code';
import {type AlertColor} from "@mui/material";
import typeOfSensorsForCreate from "@/components/dashboard/sensors/type-of-sensors-foe-create";
import {type ApiResult} from "@/types/result-api";
import {sensorsClient} from "@/components/dashboard/sensors/sensors-client";
import {type AppDispatch, RootState} from '@/store/store';
import {useDispatch} from "react-redux";
import {type DefaultValuesNewSensor} from "@/types/default-values-add-new-sensor";
import {Spinner} from "@phosphor-icons/react";
import {addTypeOfSensors} from "@/store/type-of-sensors-reducer";
import {addSensors} from "@/store/sensors-reducer";
import {type MObject} from "@/types/common-types";

interface SignUpFormNewSensorProps {
  closeModal: () => void;
  objects: MObject[] | undefined; // Replace `any` with the specific type if possible
  typesSensors: any[]; // Replace `any` with the specific type if possible
}
export function SignUpFormNewSensor({
                                      closeModal,
                                      objects,
                                      typesSensors,
                                    }:SignUpFormNewSensorProps): React.JSX.Element {
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const [isMessage, setIsMessage] = React.useState<string>('');
  const [alertColor, setAlertColor] = React.useState<AlertColor>('error');
  const [selectedSensorType, setSelectedSensorType] = React.useState('-1');
  const [selectedSensorKey, setSelectedSensorKey] = React.useState<string>('-1');
  const dispatch: AppDispatch = useDispatch();

  const schema = zod.object({
    sensor_type: zod.string().min(1, { message: 'Ввод датчика обязателен' }),
    model: zod.string().min(1, { message: 'Ввод модели обязателен' }),
    designation: zod.string().min(1, { message: 'Ввод обозначения обязателен' }),
    object_id: zod.string().min(1, { message: 'Ввод объекта обязателен' }),
    network_number: zod
      .string()
      .min(1, { message: 'Ввод сетвого номера обязателен' })
      .regex(/^\d+$/, { message: 'Значение должно состоять только из цифр' }),
    notation: zod.string(),
    sensor_key: zod.string(),
  });

  type Values = zod.infer<typeof schema>;
  const defaultValues: DefaultValuesNewSensor = {
    sensor_type: selectedSensorType,
    sensor_key: selectedSensorKey,
    model: '',
    designation: '',
    object_id: '',
    network_number: '',
    notation: '',
  } satisfies Values;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(async (values: Values): Promise<void> => {
    setIsPending(true);
    setIsMessage('');
    values.sensor_type = typeOfSensorsForCreate[values.sensor_key].type;
    const requestData = {
      request_code: await calculateRequestCode(Number(values.network_number), values.model),
      periodicity: 10000,
    };
    setIsPending(true);
    try {
      const result: ApiResult = await sensorsClient.setNewSensorToObject(values, requestData);
      if (result?.statusCode === 200) {
        dispatch(addSensors(result.allSensors));
        setIsMessage(result?.message ?? ''); // Provide a default empty string
        setAlertColor('success');
        setTimeout(() => {
          closeModal()
        }, 2000);
      } else if (result?.statusCode === 400) {
        setIsMessage(result?.message ?? '');
        setAlertColor('error');
      } else {
        setIsMessage(result?.message ?? '');
        setAlertColor('error');
      }
    } catch (error) {
      setIsMessage(`Произошла ошибка:${  (error as Error).message}`);
      setAlertColor('error');
    } finally {
      setIsPending(false);
      setTimeout(() => {
        setIsMessage("");
      }, 2500);
    }
  }, []);
  let objectOptions: any[];
  if (objects) {
    objectOptions = objects.map((user) => ({
      value: user.id,
      label: user.name,
    }));
  }

  return (
    <Stack spacing={3}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="sensor_key"
            defaultValue="-1"
            render={({ field }) => (
              <FormControl error={Boolean(errors.sensor_key)}>
                <InputLabel id="select-label">Выберите тип датчика</InputLabel>
                <Select
                  {...field}
                  labelId="select-label"
                  label="Выберите тип датчика"
                  onChange={(e) => {
                    const selectedKey = e.target.value;
                    setSelectedSensorKey(selectedKey); // Здесь сохраняем выбранный тип датчика
                    field.onChange(selectedKey); // Здесь также обновляем значение контроллера
                  }}
                >
                  <MenuItem disabled value="-1">
                    Выберите тип датчика
                  </MenuItem>
                  {typesSensors.map((sensor) => (
                    <MenuItem key={sensor.sensor_key} value={sensor.sensor_key}>
                      {sensor.sensor_type}
                    </MenuItem>
                  ))}
                </Select>
                {errors.sensor_key ? <FormHelperText>{errors.sensor_key.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="model"
            defaultValue="-1"
            render={({ field }) => (
              <FormControl error={Boolean(errors.model)}>
                <InputLabel id="select-label">Выберите модель датчика</InputLabel>
                <Select {...field} labelId="select-label" label="Выберите вариант">
                  <MenuItem disabled value="-1">
                    Выберите модель датчика
                  </MenuItem>
                  {(typesSensors.find((sensor) => sensor.sensor_key === selectedSensorKey)?.models || []).map(
                    (model:any) => (
                      <MenuItem key={model} value={model}>
                        {model}
                      </MenuItem>
                    )
                  )}
                </Select>
                {errors.model ? <FormHelperText>{errors.model.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="designation"
            render={({ field }) => (
              <FormControl error={Boolean(errors.designation)}>
                <InputLabel>Введите обозначение</InputLabel>
                <OutlinedInput {...field} label="Введите обозначение" />
                {errors.designation ? <FormHelperText>{errors.designation.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="network_number"
            render={({ field }) => {
              return (
                <FormControl error={Boolean(errors.network_number)}>
                  <InputLabel>Введите сетевой номер</InputLabel>
                  <OutlinedInput {...field} label="Введите сетевой номер" />
                  {errors.network_number ? <FormHelperText>{errors.network_number.message}</FormHelperText> : null}
                </FormControl>
              );
            }}
          />
          <Controller
            control={control}
            name="object_id"
            defaultValue="-1"
            render={({ field }) => (
              <FormControl error={Boolean(errors.object_id)}>
                <InputLabel id="select-label">Выберите объект установки</InputLabel>
                <Select {...field} labelId="select-label" label="Выберите вариант">
                  <MenuItem disabled value="-1">
                    Выберите организацию
                  </MenuItem>
                  {objectOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.object_id ? <FormHelperText>{errors.object_id.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="notation"
            render={({ field }) => (
              <FormControl error={Boolean(errors.notation)}>
                <InputLabel>Примечание</InputLabel>
                <OutlinedInput {...field} label="Примечание" />
                {errors.notation ? <FormHelperText>{errors.notation.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Button disabled={isPending} type="submit" variant="contained" sx={{ my: 1 }}>
            {isPending ? (
              <Spinner />
            ) : (
              <Box>Добавить</Box>
            )}
          </Button>
          {isMessage ? <Alert color={alertColor}>{isMessage}</Alert> : null}
        </Stack>
      </form>
    </Stack>
  );
}
