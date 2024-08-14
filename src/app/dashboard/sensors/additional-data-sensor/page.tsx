'use client';

import * as React from 'react';
import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {useDispatch, useSelector} from 'react-redux';
import {Alert, type AlertColor, Stack, Typography, Grid} from '@mui/material';
import {type AppDispatch, type RootState} from '@/store/store';
import ModalInfoAboutSensor from '@/components/modal/modal-info-about-sensor';
import MainSensorDataTable from "@/components/tables/main-sensor-data-table";
import AdditionalSensorInfoTable from "@/components/tables/additional-sensor-info-table";
import {type AdditionalSensorInfo, type SensorInfo} from "@/types/sensor";
import {sensorsClient} from "@/components/dashboard/sensors/sensors-client";
import {type ApiResult} from "@/types/result-api";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {addSensors} from "@/store/sensors-reducer";
import ModalNewAdditionalDataSensor from "@/components/modal/modal-new-additional-data-sensor";
import ModalSetLimitValueSensor from "@/components/modal/modal-set-limit-value-sensor";
import RequestSensorInfoTable from "@/components/tables/request-sensor-info-table";
import {RequestDataForSensors} from "@/types/out-sensors-data";
import {handleResponseNoModal} from "@/lib/utils/handle-response-no-modal";
import { handleResponse, handleError } from '@/lib/utils/handler-response-with-modal';

export default function Page(): React.JSX.Element {
  const [alertColor, setAlertColor] = useState<AlertColor>('success');
  const [isMessage, setIsMessage] = useState<string>('');
  const [isModalErrorOpen, setIsModalErrorOpen] = useState<boolean>(false);
  const [dataOfSensor, setIsDataOfSensor] = useState<SensorInfo>();
  const [additionalInfo, setAdditionalInfo] = useState<AdditionalSensorInfo | null>(null);
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
        setAlertColor('error');
        router.push('/dashboard/sensors'); // Redirect if data is not found
      }
    } else {
      setIsMessage('Данные датчика не найдены');
      setAlertColor('error');
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
  const successOfResult = async (data: any) => {
    try {
      const sensorsData: ApiResult = await sensorsClient.addAdditionalDataForSensor(data);
      const success = handleResponse({
        response: sensorsData,
        successMessage: 'Успешное выполнение операции',
        errorMessage: 'Неизвестная ошибка',
        dispatch,
        setIsMessageAlertModal,
        setIsAlertModalColor,
      });
      if (success) {
        setTimeout(() => {
          setIsAdditionalOpen(false);
          setIsMessageAlertModal('');
        }, 2000);
      }
    } catch (error) {
      handleError({
        error,
        setIsMessageAlertModal,
        setIsAlertModalColor,
      });
    }
  };
  const sendChangeDataForModelOnObject = async (data: any) => {
    try {
      const sensorsData: ApiResult = await sensorsClient.changeValuesDataSensor(data);
      const success = handleResponse({
        response: sensorsData,
        successMessage: 'Успешное выполнение операции',
        errorMessage: 'Неизвестная ошибка',
        dispatch,
        setIsMessageAlertModal,
        setIsAlertModalColor,
      });
      if (success) {
        setTimeout(() => {
          setIsModalLimitValueSensor(false);
          setIsMessageAlertModal('');
        }, 1000);
      }
    } catch (error) {
      handleError({
        error,
        setIsMessageAlertModal,
        setIsAlertModalColor,
      });
    }
  };
  const updateAdditionalParameterForSensors = async (value: string, parameter: string) => {
    const response: ApiResult = await sensorsClient.addAdditionalParameterForSensor(value, parameter, dataOfSensor?.id);
    handleResponseNoModal({
      response,
      setIsMessage,
      setAlertColor,
      dispatch
    });
  };
  const updateRequestDataForSensors = async (value: string, parameter: string) => {
    const sendData = {
      sensor_id: dataOfSensor?.id,
      parameter,
      model: dataOfSensor?.model,
      object_id: dataOfSensor?.object_id,
      value,
      email: ''
    };
    const response: ApiResult = await sensorsClient.addRequestDataForSensor(sendData);
    handleResponseNoModal({
      response,
      setIsMessage,
      setAlertColor,
      dispatch
    });
  };

  return (
    <Stack spacing={3}>
      <Box display="flex" justifyContent="left" sx={{marginTop: 2}}>
        <Button variant="contained" onClick={goBack} sx={{minWidth: 200}}> назад
        </Button>
      </Box>
      {dataOfSensor ? <Stack>
          <Typography variant="h4">
            {dataOfSensor.sensor_type} | {dataOfSensor.designation} {dataOfSensor.model}
          </Typography>
          <Typography variant="h5" sx={{marginY: 2}}>
            Основные данные
          </Typography>
          <MainSensorDataTable dataOfSensor={dataOfSensor} openModalErrorInfoSensor={openModalErrorInfoSensor}
                               updateAdditionalDataForSensors={updateAdditionalParameterForSensors}/>
          <Typography variant="h5" sx={{marginY: 2}}>
            Дополнительные данные
          </Typography>
          {additionalInfo ? <AdditionalSensorInfoTable additionalInfo={additionalInfo}/> : null}
          <Grid container spacing={2} sx={{marginY: 3}}>
            <Grid md={6} xs={12} display="flex" justifyContent="center">
              <Button variant="contained" onClick={openModalNewAdditionalDataSensor} sx={{minWidth: 200}}>
                Загрузить данные
              </Button>
            </Grid>
            <Grid md={6} xs={12} display="flex" justifyContent="center">
              <Button variant="contained" onClick={openSetIsModalLimitValueSensor} sx={{minWidth: 200}}>
                Управление контролем
              </Button>
            </Grid>
          </Grid>
          <RequestSensorInfoTable dataOfSensor={dataOfSensor}
                                  updateRequestDataForSensors={updateRequestDataForSensors}/>
          <Box sx={{marginY: 2}}>
            <Box>
              <sup>&#8432;</sup> Параметры устанавливаются для всех датчиков указанной модели и типа на объекте
            </Box>
            <Box>
              <sup>&#8432;&nbsp;&nbsp;&#8432;</sup> Обнуление устанавливается для всех датчиков на объекте
            </Box>
          </Box>
        </Stack> : null}
      {isMessage ? <Alert color={alertColor}>{isMessage}</Alert> : null}
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
