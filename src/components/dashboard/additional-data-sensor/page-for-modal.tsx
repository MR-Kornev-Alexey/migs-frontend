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
import {handleResponseNoModal} from "@/lib/utils/handle-response-no-modal";
import { handleResponse, handleError } from '@/lib/utils/handler-response-with-modal';
import OperationInfoAndLogForSensor from "@/components/tables/operation-info-and-log-for-sensor";
import ModalNewOperationLogSensor from "@/components/modal/modal-new-operation-log-sensor";
import {useForm} from "react-hook-form";
import BasicCard from "@/components/cards/basic-card";

export default function PageForModal(): React.JSX.Element {
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
  const [isLogsOpen, setIsLogsOpen] = useState<boolean>(false);
  const [file, setFile] = React.useState(null);
  const { control, handleSubmit } = useForm({
    defaultValues: {
      file: undefined,
    },
  });

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
    router.back();
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
  const updateNullDataForObject = async (object_id: string, parameter: boolean) => {
    const response: ApiResult = await sensorsClient.setNullForAllSensorOnObject(object_id, parameter);
    console.log(response)
    handleResponseNoModal({
      response,
      setIsMessage,
      setAlertColor,
      dispatch
    });
  };

  const closeModalNewOperationLogSensor = () => {
    setIsLogsOpen(false);
  };
  const updateOperationInfoAndLogForSensors = () => {
    setIsLogsOpen(true);
  }

  const updateLogsInfoForSensor = async (sendLogsData: SensorInfo) => {
    try {
      const sensorsData: ApiResult = await sensorsClient.addLogDataForSensor(sendLogsData);
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
          setIsLogsOpen(false);
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

  const handleSubmitNewFile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      setIsMessage('Пожалуйста, выберите файл для загрузки.');
      setAlertColor('error');
      return;
    }

    try {
      const response = await sensorsClient.saveFileAboutSensor(file, dataOfSensor?.id);
      console.log(response)
      if (response?.statusCode === 200) {
        setIsMessage('Файл успешно загружен.');
        setAlertColor('success');
        dispatch(addSensors(response?.allSensors));
        setTimeout(() => {
          setIsMessage('');
        }, 2000);
      } else {
        setIsMessage(`Ошибка загрузки файла: ${  response.error}`);
        setAlertColor('error');
      }
    } catch (error) {
      console.error(error);
      setIsMessage('Ошибка загрузки файла.');
      setAlertColor('error');
    }
  };

  const handleFileChange = (e: any) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      setIsMessage('Файл не выбран.');
      setAlertColor('error');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setIsMessage('Размер файла не должен превышать 5 МБ.');
      setAlertColor('error');
      return;
    }

    setFile(selectedFile);
    setIsMessage('Файл выбран.');
    setAlertColor('success');
  };
  return (
    <Stack spacing={3}>
      {dataOfSensor ? <Stack>
          <Typography variant="h4">
            {dataOfSensor.sensor_type} | {dataOfSensor.designation} {dataOfSensor.model}
          </Typography>
          <Typography variant="h5" sx={{marginY: 2}}>
            Основные данные
          </Typography>
          <MainSensorDataTable dataOfSensor={dataOfSensor}
                               openModalErrorInfoSensor={openModalErrorInfoSensor}
                               updateAdditionalDataForSensors={updateAdditionalParameterForSensors}
                               updateNullDataForObject={updateNullDataForObject}/>
          <Typography variant="h5" sx={{marginY: 2}}>
            Дополнительные данные
          </Typography>
          {additionalInfo ? <AdditionalSensorInfoTable additionalInfo={additionalInfo}/> : null}
          <Grid container spacing={2} sx={{marginY: 3}}>
            <Grid
              md={6}
              xs={12}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Button
                variant="contained"
                onClick={openModalNewAdditionalDataSensor}
                sx={{ marginBottom: { md: 0, xs: 2 }, minWidth: 200 }}
              >
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
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="h5">Данные по журналам</Typography>
          <OperationInfoAndLogForSensor dataOfSensor={dataOfSensor}
                                        updateOperationInfoAndLogForSensors={updateOperationInfoAndLogForSensors} />
        </Box>

        <Typography variant="h5" sx={{ marginTop: 2 }}>
          Копии документов
        </Typography>
        <Box
          display="flex"
          flexWrap="wrap" // Позволяет переносить карточки на новую строку при нехватке места
          justifyContent={{ xs: 'center', md: 'space-around' }}  // Центрирование карточек
          gap={2} // Отступ между карточками
          sx={{ padding: { xs: 1, md: 2 } } } // Внешний отступ
        >
          {dataOfSensor.files.map((item: any, index: number) => (
              <BasicCard url={item.url} key={index}  />
          ))}
        </Box>
        <Box sx={{ marginY: 3 }}>
          <form onSubmit={handleSubmitNewFile}>
            <input type="file" onChange={handleFileChange} />
            <Button variant="contained" type="submit"  sx={{ marginTop: { md: 0, xs: 2 }, minWidth: 200 }}>
              Загрузить документ
            </Button>
          </form>
        </Box>
        <Box sx={{marginY: 2}}>
          <Box>
            <sup>&#8432;</sup> Параметры устанавливаются для всех датчиков указанной модели и типа на объекте
          </Box>
          <Box>
            <sup>&#8432;&nbsp;&nbsp;&#8432;</sup> Обнуление установлено для всех датчиков на объекте <span style={{fontWeight: "bold"}}>{dataOfSensor.object.name} {dataOfSensor.object.address} </span>
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
      <ModalNewOperationLogSensor isOpen={isLogsOpen}
                                  onClose={closeModalNewOperationLogSensor}
                                  dataOfSensor={dataOfSensor}
                                  isMessageAlertModal={isMessageAlertModal}
                                  isAlertModalColor={isAlertModalColor}
                                  updateLogsInfoForSensor={updateLogsInfoForSensor}/>
    </Stack>
  );
}
