'use client';

import * as React from 'react';
import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {useDispatch, useSelector} from 'react-redux';
import {Alert, AlertColor, Stack, Typography, Grid} from '@mui/material';
import {AppDispatch, RootState} from '@/store/store';
import ModalInfoAboutSensor from '@/components/modal/modal-info-about-sensor';
import MainSensorDataTable from "@/components/tables/main-sensor-data-table";
import AdditionalSensorInfoTable from "@/components/tables/additional-sensor-info-table";
import {AdditionalSensorInfo, SensorInfo} from "@/types/sensor";
import {sensorsClient} from "@/components/dashboard/sensors/sensors-client";
import {ApiResult} from "@/types/result-api";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {addSensors} from "@/store/sensors-reducer";
import ModalNewAdditionalDataSensor from "@/components/modal/modal-new-additional-data-sensor";
import ModalSetLimitValueSensor from "@/components/modal/modal-set-limit-value-sensor";

export default function Page(): React.JSX.Element {
  const [alertFileColor, setAlertFileColor] = useState<AlertColor>('success');
  const [isModalErrorOpen, setIsModalErrorOpen] = useState<boolean>(false);
  const [dataOfSensor, setIsDataOfSensor] = useState<SensorInfo>();
  const [additionalInfo, setAdditionalInfo] = useState<AdditionalSensorInfo | null>(null);
  const [isMessage, setIsMessage] = useState<string>('');
  const router = useRouter();
  const allSensors = useSelector((state: RootState) => state.allSensors.value);
  const selectedID: string = useSelector((state: RootState) => state.selectedSensor.value);
  const [isAdditionalOpen, setIsAdditionalOpen] = useState<boolean>(false);
  const [isModalLimitValueSensor, setIsModalLimitValueSensor] = useState<boolean>(false);
  const dispatch: AppDispatch = useDispatch();
  const [isMessageAlertModal, setIsMessageAlertModal] = useState<string>('');
  const [isAlertModalColor, setIsAlertModalColor] = useState<AlertColor>('error');

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


  const goBack = () => {
    router.push('/dashboard/sensors');
  };

  const updateAdditionalParameterForSensors = async (value: string, parameter: string) => {
    console.log(value, parameter)
    const sensorsData: ApiResult = await sensorsClient.addAdditionalParameterForSensor(value, parameter, dataOfSensor?.id)
    dispatch(addSensors(sensorsData?.allSensors));
  };
  const openModalNewAdditionalDataSensor = () => {
    setIsAdditionalOpen(true);
  };
  const openSetIsModalLimitValueSensor = () => {
    setIsModalLimitValueSensor(true);
  };

  const closeIsModalLimitValueSensor = () => {
    setIsModalLimitValueSensor(false);
  };

  const closeModalNewAdditionalDataSensor = () => {
    setIsAdditionalOpen(false);
  };
  const handleResponse = (response: ApiResult, successMessage: string, errorMessage: string) => {
    if (response?.statusCode === 200) {
      dispatch(addSensors(response?.allSensors));
      setIsMessageAlertModal(response?.message || successMessage);
      setIsAlertModalColor("success");
      return true;
    } else {
      setIsAlertModalColor("error");
      setIsMessageAlertModal(response?.message || errorMessage);
      return false;
    }
  };

  const handleError = (error: any) => {
    setIsAlertModalColor("error");
    setIsMessageAlertModal(error?.message || 'Ошибка при выполнении запроса');
  };

  const successOfResult = async (data: any) => {
    try {
      // Попытка отправить запрос и получить данные
      const sensorsData: ApiResult = await sensorsClient.addAdditionalDataForSensor(data);
      const success = handleResponse(sensorsData, 'Успешное выполнение операции', 'Неизвестная ошибка');
      if (success) {
        setTimeout(() => {
          setIsAdditionalOpen(false);
          setIsMessageAlertModal('');
        }, 2000);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const sendChangeDataForModelOnObject = async (data: any) => {
    try {
      // Попытка отправить запрос и получить данные
      const sensorsData: ApiResult = await sensorsClient.changeValuesDataSensor(data);
      const success = handleResponse(sensorsData, 'Успешное выполнение операции', 'Неизвестная ошибка');
      if (success) {
        setTimeout(() => {
          setIsModalLimitValueSensor(false);
          setIsMessageAlertModal('');
        }, 2000);
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <Stack spacing={3}>
      <Box display="flex" justifyContent="left" sx={{marginTop: 2}}>
        <Button variant="contained" onClick={goBack}> назад
        </Button>
      </Box>
      {dataOfSensor && (
        <Stack>
          <Typography variant="h4">
            {dataOfSensor.sensor_type} | {dataOfSensor.designation} {dataOfSensor.id}
          </Typography>
          <Typography variant="h5" sx={{marginY: 2}}>
            Основные данные
          </Typography>
          <MainSensorDataTable dataOfSensor={dataOfSensor} openModalErrorInfoSensor={openModalErrorInfoSensor}
                               updateAdditionalDataForSensors={updateAdditionalParameterForSensors}/>
          <Typography variant="h5" sx={{marginY: 2}}>
            Дополнительные данные
          </Typography>
          {additionalInfo && <AdditionalSensorInfoTable additionalInfo={additionalInfo}/>}
          <Grid container spacing={2} sx={{ marginY: 3 }}>
            <Grid  md={6} xs={12} display="flex" justifyContent="center">
              <Button variant="contained" onClick={openModalNewAdditionalDataSensor}>
                Загрузить данные
              </Button>
            </Grid>
            <Grid md={6} xs={12} display="flex" justifyContent="center">
              <Button variant="contained" onClick={openSetIsModalLimitValueSensor}>
                Управление контролем
              </Button>
            </Grid>
          </Grid>
        </Stack>
      )}
      {isMessage && <Alert color={alertFileColor}>{isMessage}</Alert>}
      <ModalInfoAboutSensor
        isOpen={isModalErrorOpen}
        onClose={closeModalErrorInfoSensor}
        dataError={dataOfSensor?.error_information}
      />
      <ModalNewAdditionalDataSensor
        isOpen={isAdditionalOpen}
        onClose={closeModalNewAdditionalDataSensor}
        sensorMain={dataOfSensor}
        successOfResult={successOfResult}
        isMessageAlertModal={isMessageAlertModal}
        isAlertModalColor={isAlertModalColor}
      />
      <ModalSetLimitValueSensor
        isOpen={isModalLimitValueSensor}
        onClose={closeIsModalLimitValueSensor}
        sensorMain={dataOfSensor}
        sendChangeDataForModelOnObject={sendChangeDataForModelOnObject}
        isMessageAlertModal={isMessageAlertModal}
        isAlertModalColor={isAlertModalColor}
      />
    </Stack>
  );
}
