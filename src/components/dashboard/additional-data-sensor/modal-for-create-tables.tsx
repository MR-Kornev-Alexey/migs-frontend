'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Modal, Box, Stack, Grid, Typography, Button, Alert, type AlertColor } from '@mui/material';
import { X } from '@phosphor-icons/react';
import AboutObjectPaginationAndSelectForTable from "@/components/tables/sensors-pagination-and-select-table-for-tables";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import SelectTimePeriod from "@/components/select/select-time-period";
import { type ApiResult } from "@/types/result-api";
import { sensorsDataClient } from "@/components/dashboard/additional-data-sensor/sensors-data-client";
import groupAndSortSensorData from "@/components/dashboard/tables/group-and-sort-sensor-data";
import SensorDataStrainGauge from "@/components/dashboard/tables/sensor-data-strain-gauge";
import SensorDataInclinoMeter from "@/components/dashboard/tables/sensor-data-inclino-meter";
import { type MObject, type GroupedSensorData } from "@/types/common-types";


interface ModalAboutOneCustomerProps {
  isOpenModalCreateData: boolean;
  onClose: () => void;
}

interface Period {
  startDate: string;
  endDate: string;
}
interface SensorInfo {
  sensor_type: string;
  model: string;
  designation: string;
  coefficient: number;
  limitValue: number;
}

interface SensorDataInclinoMeterProps {
  rows: {
    request_code: string;
    answer_code: string;
    created_at: string;
  }[];
  sensorInfo: SensorInfo[]; // Исправляем на объект
}

interface SensorDataStrainGaugeProps {
  rows: {
    request_code: string;
    answer_code: string;
    created_at: string;
  }[];
  sensorInfo: SensorInfo[]; // Исправляем на объект
}
type SensorKey = 'inclinoMeter' | 'strainGauge';


const ModalForCreateTables: React.FC<ModalAboutOneCustomerProps> = ({ isOpenModalCreateData, onClose }) => {
  const object: MObject | undefined = useSelector((state: RootState) => state.selectedObjects.value[0]);
  const [isPeriod, setIsPeriod] = useState<Period | null>(null);
  const [isSetOneHour, setOneHour] = useState<boolean>(false);
  const [isInfoMessage, setIsInfoMessage] = useState<string>('');
  const [alertColor, setAlertColor] = useState<AlertColor>('error');
  const [sortedData, setSortedData] = useState<GroupedSensorData[]>([]);
  const [selectedSensors, setSelectedSensors] = useState<string[]>([]);

  const resetModalState = useCallback(() => {
    setIsPeriod(null);
    setOneHour(false);
    setIsInfoMessage('');
    setAlertColor('error');
    setSortedData([]);
    setSelectedSensors([]);
  }, []);

  const handleClose = () => {
    resetModalState();
    onClose();
  };

  useEffect(() => {
    setSortedData([]);
  }, []);

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
        const sortedData = await groupAndSortSensorData(result.data?.groupedData);
        console.log('sortedData ---', sortedData)
        setSortedData(sortedData);
        setAlertColor('success');
        setIsInfoMessage(result.data?.message || '');
      } else {
        setAlertColor('error');
        setIsInfoMessage(result.data?.message || 'Произошла ошибка');
      }
    } catch (error) {
      setAlertColor('error');
      setIsInfoMessage('Ошибка загрузки данных');
    } finally {
      setTimeout(() => { setIsInfoMessage(''); }, 2000);
    }
  };

  const sensorComponents: Record<SensorKey, React.FunctionComponent<any>> = {
    inclinoMeter: SensorDataInclinoMeter,
    strainGauge: SensorDataStrainGauge,
  };
  const openAddInfoAboutSensors = (id: string) => {
    console.log(id);
  };

  return (
    <Modal open={isOpenModalCreateData} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          maxWidth: '80%',
          maxHeight: '80vh',
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
          overflowY: 'auto',
        }}
      >
        <Stack>
          <X size={32} onClick={handleClose} style={{ cursor: 'pointer', position: 'absolute', right: 12, top: 12 }} />
          <Box sx={{ overflowY: 'auto', padding: 2, maxHeight: 'calc(80vh - 64px)' }}>
            <Box display='flex' justifyContent='center'>
              <Typography variant="h5">{object?.name}</Typography>
            </Box>
            <AboutObjectPaginationAndSelectForTable
              openAddInfoAboutSensors={openAddInfoAboutSensors}
              rows={object?.Sensor || []}
              onSelectedSensors={onSelectedSensors}
            />
            <Grid container spacing={3} sx={{ marginY: 3 }} justifyContent="center">
              <Grid xs={12} sx={{ marginTop: 2 }} display='flex' justifyContent='center'>
                <Typography variant="body1">Для формирования таблиц выберите период</Typography>
              </Grid>
              <Grid xs={12} md={6} display="flex" justifyContent="center">
                <Box>
                  <SelectTimePeriod setPeriodToParent={setIsPeriod} setOneHour={setOneHour} />
                  <Button
                    variant="contained"
                    disabled={!selectedSensors.length || !isPeriod}
                    onClick={openMainTableForObject}
                    sx={{ width: 260, height: 48, marginTop: 2 }}
                  >
                    Загрузить таблицы
                  </Button>
                </Box>
              </Grid>
            </Grid>
            <Box>
              {sortedData.map((sensorData: GroupedSensorData, index) => {
                const SensorComponent = sensorComponents[sensorData.sensor_key as keyof typeof sensorComponents];
                if (!SensorComponent) return null; // Skip if component is not found
                return (
                  <SensorComponent
                    key={index}
                    rows={sensorData.data}
                    sensorInfo={[
                      { sensor_type: sensorData.sensor_type, model: sensorData.model, designation: sensorData.designation, coefficient: sensorData.coefficient, limitValue: sensorData.limitValue }
                    ]}
                  />
                );
              })}
            </Box>
            {isInfoMessage && <Alert color={alertColor} sx={{ marginTop: 2 }}>{isInfoMessage}</Alert>}
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ModalForCreateTables;
