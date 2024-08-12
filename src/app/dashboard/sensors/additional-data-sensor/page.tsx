'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { Alert, AlertColor, Stack, Typography } from '@mui/material';
import { RootState } from '@/store/store';
import ModalInfoAboutSensor from '@/components/modal/modal-info-about-sensor';
import MainSensorDataTable from "@/components/tables/main-sensor-data-table";
import AdditionalSensorInfoTable from "@/components/tables/additional-sensor-info-table";
import {AdditionalSensorInfo, SensorInfo} from "@/types/sensor";

export default function Page(): React.JSX.Element {
  const [alertFileColor, setAlertFileColor] = useState<AlertColor>('success');
  const [isModalErrorOpen, setIsModalErrorOpen] = useState<boolean>(false);
  const [dataOfSensor, setIsDataOfSensor] = useState<SensorInfo | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState<AdditionalSensorInfo | null>(null);
  const [isMessage, setIsMessage] = useState<string>('');

  const router = useRouter();
  const allSensors = useSelector((state: RootState) => state.allSensors.value);
  const selectedID: string = useSelector((state: RootState) => state.selectedSensor.value);

  useEffect(() => {
    if (selectedID) {
      const sensorData = allSensors?.find((s: SensorInfo) => s.id === selectedID);

      if (sensorData) {
        setIsMessage('');
        setIsDataOfSensor(sensorData);
        setAdditionalInfo(sensorData.additional_sensor_info[0] ?? null); // Track the first additional sensor info
      } else {
        setIsMessage('Данные датчика не найдены');
        setAlertFileColor('error');
        router.push('/dashboard/sensors'); // Redirect if data is not found
      }
    } else {
      setIsMessage('Данные датчика не найдены');
      setAlertFileColor('error');
      router.push('/dashboard/sensors'); // Redirect if no ID is selected
    }
  }, [allSensors, selectedID, router]);

  const openModalErrorInfoSensor = () => {
    setIsModalErrorOpen(true);
  };

  const closeModalErrorInfoSensor = () => {
    setIsModalErrorOpen(false);
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Данные датчика</Typography>
      {dataOfSensor && (
        <Stack>
          <Typography variant="h4">
            {dataOfSensor.sensor_type} | {dataOfSensor.designation}
          </Typography>
          <Typography variant="h5" sx={{ marginY: 2 }}>
            Основные данные
          </Typography>
          <MainSensorDataTable dataOfSensor={dataOfSensor} openModalErrorInfoSensor={openModalErrorInfoSensor} />
          <Typography variant="h5" sx={{ marginY: 2 }}>
            Дополнительные данные
          </Typography>
          {additionalInfo && <AdditionalSensorInfoTable additionalInfo={additionalInfo} />}
        </Stack>
      )}
      {isMessage && <Alert color={alertFileColor}>{isMessage}</Alert>}
      <ModalInfoAboutSensor
        isOpen={isModalErrorOpen}
        onClose={closeModalErrorInfoSensor}
        dataError={dataOfSensor?.error_information}
      />
    </Stack>
  );
}
