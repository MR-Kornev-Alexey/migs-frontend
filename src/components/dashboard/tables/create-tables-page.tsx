'use client';
import React, {useEffect, useState, useCallback} from 'react';
import {Box, Stack, Grid, Typography, Button, type AlertColor, Alert} from '@mui/material';
import AboutObjectPaginationAndSelectForTable from "@/components/tables/sensors-pagination-and-select-table-for-tables";
import {useDispatch, useSelector} from "react-redux";
import type {AppDispatch, RootState} from "@/store/store";
import SelectTimePeriod from "@/components/select/select-time-period";
import {type ApiResult} from "@/types/result-api";
import {sensorsDataClient} from "@/components/dashboard/additional-data-sensor/sensors-data-client";
import groupAndSortSensorData from "@/components/dashboard/tables/group-and-sort-sensor-data";
import SensorDataStrainGauge from "@/components/dashboard/tables/sensor-data-strain-gauge";
import SensorDataInclinoMeter from "@/components/dashboard/tables/sensor-data-inclino-meter";
import {type MObject, type GroupedSensorData} from "@/types/common-types";
import {addSelectedSensor} from "@/store/selected-sensor-reducer";
import ModalForAdditionalDataSensors
  from "@/components/dashboard/additional-data-sensor/modal-for-additional-data-sensors";


interface ModalAboutOneCustomerProps {
  mainUser: string;
  isCounter: number;
}

interface Period {
  startDate: string;
  endDate: string;
}

type SensorKey = 'inclinoMeter' | 'strainGauge';

const CreateTablesPage: React.FC<ModalAboutOneCustomerProps> = ({mainUser, isCounter}) => {
  const object: MObject | undefined = useSelector((state: RootState) => state.selectedObjects.value[0]);
  const [isPeriod, setIsPeriod] = useState<Period | null>(null);
  const [isSetOneHour, setOneHour] = useState<boolean>(false);
  const [isMessage, setIsMessage] = useState<string>('');
  const [alertColor, setAlertColor] = useState<AlertColor>('error');
  const [sortedData, setSortedData] = useState<GroupedSensorData[]>([]);
  const [selectedSensors, setSelectedSensors] = useState<string[]>([]);
  const dispatch: AppDispatch = useDispatch();
  const [isOpenModalAddData, setIsOpenModalAddData] = useState<boolean>(false);

  useEffect(() => {
    setSortedData([]);
  }, [isCounter]);

  const onSelectedSensors = (sensorsId: Set<any>) => {
    setSelectedSensors(Array.from(sensorsId));
  };

  const openMainTableForObject = async () => {
    if (!selectedSensors.length || !isPeriod) return;

    try {
      const sendData = {
        period: isPeriod,
        objectId: object?.id,
        selectedSensors,
        isOneHour: isSetOneHour
      };

      const result: ApiResult = await sensorsDataClient.getGroupedDataForSelectedObject(sendData);

      if (result.data?.statusCode === 200) {
        const sortedData: GroupedSensorData[] = await groupAndSortSensorData(result.data?.groupedData);
        setSortedData(sortedData);
        setAlertColor('success');
        setIsMessage(result.data?.message || '');
      } else {
        setAlertColor('error');
        setIsMessage(result.data?.message || 'Произошла ошибка');
      }
    } catch (error) {
      setAlertColor('error');
      setIsMessage('Ошибка загрузки данных');
    } finally {
      setTimeout(() => {
        setIsMessage('');
      }, 2000);
    }
  };

  const sensorComponents: Record<SensorKey, React.FunctionComponent<any>> = {
    inclinoMeter: SensorDataInclinoMeter,
    strainGauge: SensorDataStrainGauge,
  };

  async function openAddInfoAboutSensors(sensor_id: string) {
    dispatch(addSelectedSensor(sensor_id));
    setIsOpenModalAddData(true);
  }

  const closeModalAddData = () => {
    setIsOpenModalAddData(false);
  };

  return (
    <Stack>
      <Box display='flex' justifyContent='center'>
        <Typography variant="h5">{object?.name}</Typography>
      </Box>
      <AboutObjectPaginationAndSelectForTable
        openAddInfoAboutSensors={openAddInfoAboutSensors}
        rows={object?.Sensor || []}
        onSelectedSensors={onSelectedSensors}
      />
      <Grid container spacing={3} sx={{marginY: 3}} justifyContent="center">
        <Grid xs={12} sx={{marginTop: 2}} display='flex' justifyContent='center'>
          <Typography variant="body1">Для формирования таблиц выберите период</Typography>
        </Grid>
        <Grid xs={12} md={6} display="flex" justifyContent="center">
          <Box>
            <SelectTimePeriod setPeriodToParent={setIsPeriod} setOneHour={setOneHour}/>
            <Button
              variant="contained"
              disabled={!selectedSensors.length || !isPeriod}
              onClick={openMainTableForObject}
              sx={{width: 260, height: 48, marginTop: 2}}
            >
              Загрузить таблицы
            </Button>
          </Box>
        </Grid>
      </Grid>
      {isMessage ? <Alert color={alertColor}>{isMessage}</Alert> : null}
      <Box>
        {sortedData.map((sensorData: GroupedSensorData, index) => {
          const SensorComponent = sensorComponents[sensorData.sensor_key as keyof typeof sensorComponents];
          if (!SensorComponent) return null; // Skip if component is not found
          return (
            <SensorComponent
              key={index}
              rows={sensorData.data}
              sensorInfo={[
                {
                  sensor_type: sensorData.sensor_type,
                  model: sensorData.model,
                  designation: sensorData.designation,
                  coefficient: sensorData.coefficient,
                  limitValue: sensorData.limitValue
                }
              ]}
            />
          );
        })}
      </Box>

      <ModalForAdditionalDataSensors
        mainUser={mainUser}
        isOpenModalAddData={isOpenModalAddData}
        onClose={closeModalAddData}
      />
    </Stack>
  );
};

export default CreateTablesPage;
