'use client';
import React, { useEffect, useState } from 'react';
import { Modal, Box, Stack, Grid, Typography, Button, Alert, type AlertColor } from '@mui/material';
import { X } from '@phosphor-icons/react';
import AboutObjectPaginationAndSelectForTable from "@/components/tables/sensors-pagination-and-select-table-for-tables";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import SelectTimePeriod from "@/components/select/select-time-period";
import { type ApiResult } from "@/types/result-api";
import { sensorsDataClient } from "@/components/dashboard/additional-data-sensor/sensors-data-client";
import { transformToChartData } from "@/components/charts/transform-to-chart-data";
import { type VictoryChartData } from "@/types/victory-chart-data";
import MainVictoryBarChart from "@/components/charts/victory/main-victory-charts";
import ModalForAdditionalDataSensors from "@/components/dashboard/additional-data-sensor/modal-for-additional-data-sensors";
import { addSelectedSensor } from "@/store/selected-sensor-reducer";
import { NewSensor } from "@/types/common-types";

interface ModalAboutOneCustomerProps {
  isOpenModalCreateData: boolean;
  onClose: () => void;
}

interface Period {
  startDate: string;
  endDate: string;
}

const ModalForCreateCharts: React.FC<ModalAboutOneCustomerProps> = ({ isOpenModalCreateData, onClose }) => {
  const oneObject = useSelector((state: RootState) => state.selectedObjects.value[0]);
  const [isPeriod, setIsPeriod] = useState<Period | null>(null);
  const [isSetOneHour, setOneHour] = useState<boolean>(false);
  const [isInfoMessage, setIsInfoMessage] = useState<string>('');
  const [alertColor, setAlertColor] = useState<AlertColor>('error');
  const [selectedSensors, setSelectedSensors] = useState<any[]>([]);
  const [chartsData, setChartsData] = useState<VictoryChartData[]>([]);
  const [visibleChart, setVisibleChart] = useState<boolean>(false);
  const [isOpenModalAddData, setIsOpenModalAddData] = useState<boolean>(false);
  const dispatch: AppDispatch = useDispatch();

  const order: string[] = ['strainGauge', 'inclinoMeter', 'rangefinder', 'GNSSReceiver', 'temperatureSensor', 'weatherStation'];

  // Function to reset the modal state
  const resetModalState = () => {
    setIsPeriod(null);
    setOneHour(false);
    setIsInfoMessage('');
    setAlertColor('error');
    setSelectedSensors([]);
    setChartsData([]);
    setVisibleChart(false);
  };

  const handleClose = () => {
    resetModalState();
    setTimeout(() => {
      onClose();
    }, 500);
  };

  useEffect(() => {
    resetModalState();
  }, []);

  const onSelectedSensors = (sensorsId: Set<any>) => {
    setSelectedSensors(Array.from(sensorsId));
  };

  const openAddInfoAboutSensors = (id: string) => {
    dispatch(addSelectedSensor(id));
    setIsOpenModalAddData(true);
  };

  const closeModalAddData = () => {
    setIsOpenModalAddData(false);
  };

  const showMainCharts = async () => {
    if (!oneObject || !selectedSensors.length) return;

    const result: ApiResult = await sensorsDataClient.getLastValuesDataForSelectedSensors(oneObject.id, selectedSensors);
    if (result?.data?.statusCode === 200) {
      const dataForCharts = await transformToChartData(result?.data?.selectedObject[0]);
      setChartsData(dataForCharts);
      setVisibleChart(true);
    }
  };

  const hideMainCharts = () => {
    setChartsData([]);
    setVisibleChart(false);
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
          <X size={32} onClick={handleClose} style={{ cursor: 'pointer', position: "absolute", right: 40, top: 28 }} />
          <Box sx={{ overflowY: 'auto', padding: 2, maxHeight: 'calc(80vh - 64px)' }}>
            <Box display='flex' justifyContent='center'>
              <Typography variant="h5">{oneObject?.name}</Typography>
            </Box>
            <AboutObjectPaginationAndSelectForTable
              openAddInfoAboutSensors={openAddInfoAboutSensors}
              rows={oneObject?.Sensor}
              onSelectedSensors={onSelectedSensors}
            />
            <Grid container spacing={3} sx={{ marginY: 2 }} display="flex" justifyContent="center">
              <Grid md={4} xs={12} display="flex" justifyContent="center">
                <Button variant="contained" disabled={selectedSensors?.length === 0} sx={{ width: 260, marginTop: 1 }} onClick={showMainCharts}>
                  Загрузить гистограмму
                </Button>
              </Grid>
              <Grid md={4} xs={12} display="flex" justifyContent="center">
                <Button variant="contained" sx={{ width: 260, marginTop: 1 }} onClick={hideMainCharts}>
                  Скрыть гистограмму
                </Button>
              </Grid>
            </Grid>
            {chartsData.length > 0 && visibleChart ? <MainVictoryBarChart data={chartsData} /> : null}
            <Grid container spacing={3} sx={{ marginY: 3 }} justifyContent="center">
              <Grid xs={12} sx={{ marginTop: 2 }} display='flex' justifyContent='center'>
                <Typography variant="body1">Для формирования графиков выберите период</Typography>
              </Grid>
              <Grid xs={12} md={6} display="flex" justifyContent="center">
                <Box>
                  <SelectTimePeriod setPeriodToParent={setIsPeriod} setOneHour={setOneHour} />
                  <Button
                    variant="contained"
                    disabled={selectedSensors.length === 0 || !isPeriod}
                    sx={{ width: 260, height: 48, marginTop: 2 }}
                  >
                    Загрузить график
                  </Button>
                </Box>
              </Grid>
            </Grid>

            {isInfoMessage ? <Alert color={alertColor} sx={{ marginTop: 2 }}>
              {isInfoMessage}
            </Alert> : null}
          </Box>
          <ModalForAdditionalDataSensors isOpenModalAddData={isOpenModalAddData} onClose={closeModalAddData} />
        </Stack>
      </Box>
    </Modal>
  );
};

export default ModalForCreateCharts;
