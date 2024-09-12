"use client"

import React, {useState, useEffect} from 'react';
import {Box, Button, Grid, Stack, Typography} from '@mui/material';
import {useDispatch, useSelector} from "react-redux";
import {type AppDispatch, type RootState} from '@/store/store';
import AllObjectsPaginationSelectTable from "@/components/tables/all-objects-pagination-select-table";
import type {MObject, NewSensor, DataFromSensor} from "@/types/common-types";
import {addSelectedObjects, clearSelectedObjects} from "@/store/selected-objects-reducer";
import AboutObjectPaginationAndSelectForTable from "@/components/tables/sensors-pagination-and-select-table-for-tables";
import {addSelectedSensor} from "@/store/selected-sensor-reducer";
import ModalDataObject from "@/components/modal/modal-data-object";
import ModalForAdditionalDataSensors
  from "@/components/dashboard/additional-data-sensor/modal-for-additional-data-sensors";
import type {ApiResult} from "@/types/result-api";
import {sensorsDataClient} from "@/components/dashboard/additional-data-sensor/sensors-data-client";
import {transformToChartData} from "@/components/charts/transform-to-chart-data";
import type {VictoryChartData} from "@/types/victory-chart-data";
import MainVictoryBarChart from "@/components/charts/victory/main-victory-charts";
import {useRouter} from "next/navigation";
import {addSelectedSensorsForCharts} from "@/store/selected-sensors-for-charts-reducer";
import {BASE_URL} from "@/config";
import AreaVictoryChart from "@/components/charts/victory/area-victory-charts";
import transformGroupedDataForAreaVictory from "@/components/charts/transorm-grouped-data-for-area-chart";
import {addSelectedObjectForCharts} from "@/store/selected-object-for-charts-reducer";


export default function Page(): React.JSX.Element {
  const [isOpenModalCreateData, setIsOpenModalCreateData] = useState<boolean>(false);
  const allObjects = useSelector((state: RootState) => state.allObjects.value);
  const [isOpenDataObject, setIsOpenDataObject] = useState<boolean>(false);
  const [isSelectObject, setIsSelectObject] = useState<MObject | undefined>();
  const dispatch: AppDispatch = useDispatch();
  const [selectedSensors, setSelectedSensors] = useState<any[]>([]);
  const [isOpenModalAddData, setIsOpenModalAddData] = useState<boolean>(false);
  const [visibleChart, setVisibleChart] = useState<boolean>(false);
  const [visibleDynamicChart, setVisibleDynamicChart] = useState<boolean>(false);
  const oneObject = useSelector((state: RootState) => state.selectedObjects.value[0]);
  const [isResultFromApi, setIsResultFromApi] = useState<any[]>([]);
  const [isTerminalRunning, setIsTerminalRunning] = useState(false);
  const [chartsData, setChartsData] = useState<VictoryChartData[]>([]);
  const [dataDynamicChartsData, setDynamicChartsData] = useState<TransformedData[]>([]);
  const [mainUser, setMainUser] = useState< string | null>(null);
  const router = useRouter();
  const onSelectedSensors = (sensorsId: Set<any>) => {
    setSelectedSensors(Array.from(sensorsId));
  };

  interface TransformedData {
    sensorId: string;
    sensorName: string;
    sensorLocation: string;
    sensorColor: string;
    sensorMin: number;
    sensorMax: number;
    sensorZero: number;
    sensorData: { x: string; y: number }[];
  }

  const closeDataObject = () => {
    setIsOpenDataObject(false);
  };

  const sortedSensors = (sensors: NewSensor[]) => {
    return [...sensors].sort((a, b) => a.model.localeCompare(b.model));
  };

  async function selectOneObjectForTable(selectedId: string) {
    try {
      if (!selectedId) {
        return;
      }
      if (!allObjects) {
        console.error('allObjects is undefined');
        return; // или другая логика обработки ошибки
      }
      const selectedObject: MObject | undefined = allObjects.find((object: MObject) => object.id === selectedId);

      if (selectedObject) {
        const sortedSensorsList = sortedSensors(selectedObject.Sensor);
        const updatedObject = {
          ...selectedObject,
          Sensor: sortedSensorsList,
        };
        dispatch(addSelectedObjects([updatedObject]));
        setIsOpenModalCreateData(true);
      } else {
        console.warn("Object not found:", selectedId);
      }
    } catch (error) {
      console.error("Ошибка при обновлении выбранного объекта:", error);
    }
  }

  const selectOneObjectForInfo = (iDObject: string) => {
    setIsOpenDataObject(true);
    if (!allObjects) {
      console.error('allObjects is undefined');
      return; // или другая логика обработки ошибки
    }
    const selectedObject = allObjects.find((obj: MObject) => obj.id === iDObject);
    setIsSelectObject(selectedObject);
  };

  async function openAddInfoAboutSensors(sensor_id: string) {
    dispatch(addSelectedSensor(sensor_id));
    setIsOpenModalAddData(true);
  }

  const closeModalAddData = () => {
    setIsOpenModalAddData(false);
  };

  // Очистка данных при размонтировании компонента
  useEffect(() => {
    return () => {
      setIsOpenModalCreateData(false);
      setIsOpenModalAddData(false);
      setIsSelectObject(undefined);
      dispatch(clearSelectedObjects([]))
    };
  }, [dispatch]);

  const hideMainCharts = () => {
    setChartsData([]);
    setVisibleChart(false);
  };

  const hideDynamicCharts = () => {
    setDynamicChartsData([]);
    setVisibleDynamicChart(false);
  };
  const showMainCharts = async () => {
    if (!oneObject || !selectedSensors.length) return;
    const result: ApiResult = await sensorsDataClient.getLastValuesDataForSelectedSensors(oneObject.id, selectedSensors);
    if (result?.data?.statusCode === 200) {
      setIsResultFromApi(result?.data?.selectedObject[0])
      const dataForCharts = await transformToChartData(result?.data?.selectedObject[0]);
      setChartsData(dataForCharts);
      setVisibleChart(true);
      hideDynamicCharts();
    }
  };
  const showLineCharts = async () => {
    if (!oneObject || !selectedSensors.length) return;
    console.log('oneObject  ---', oneObject);
    // Преобразование одиночного объекта в массив, если нужно
    dispatch(addSelectedSensorsForCharts(selectedSensors));
    dispatch(addSelectedObjectForCharts([oneObject])); // Передача одиночного объекта
    router.push('/dashboard/charts/line-charts-sensor');
  };

  const showDynamicCharts = async () => {
    if (!oneObject || !selectedSensors.length) return;

    setChartsData([]);
    setVisibleChart(false);

    const result: ApiResult = await sensorsDataClient.getLastValuesDataForDynamicCharts(oneObject.id, selectedSensors);

    if (result?.data?.statusCode === 200) {
      console.log('result?.data?.groupedData:', result?.data?.groupedData);
      const createdDataForDynamicCharts = await transformGroupedDataForAreaVictory(result?.data?.groupedData);
      console.log('Initial data for dynamic charts:', createdDataForDynamicCharts);

      setDynamicChartsData(createdDataForDynamicCharts);
      setVisibleDynamicChart(true);
      //
      await startTerminalForDynamic();
    }
  };

  useEffect(() => {
    // Это сработает, когда dataDynamicChartsData обновляется
    if (dataDynamicChartsData.length > 0 && isTerminalRunning) {
      console.log('dataDynamicChartsData is ready for updates:', dataDynamicChartsData);
    }
  }, [dataDynamicChartsData]);

  const startTerminalForDynamic = async () => {
    const newEventSource = new EventSource(`${BASE_URL}/sse/events`);
    newEventSource.onmessage = async (event) => {
      const data: DataFromSensor = JSON.parse(event.data);
      const result: ApiResult = await sensorsDataClient.getLastValuesDataForDynamicCharts(oneObject.id, selectedSensors);
      if (result?.data?.statusCode === 200) {
        const createdDataForDynamicCharts = await transformGroupedDataForAreaVictory(result?.data?.groupedData);
        setDynamicChartsData(createdDataForDynamicCharts);
      }
    };
    newEventSource.onerror = (error) => {
      newEventSource.close();
      setIsTerminalRunning(false);
    };
    setIsTerminalRunning(true);
  }
  useEffect(() => {
    const userString = localStorage.getItem('custom-auth-token');
    if (userString) {
      try {
        setMainUser(userString);
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }
  }, []);

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Графики</Typography>
      <Typography variant="body1">Для построения выберите объект</Typography>
      <AllObjectsPaginationSelectTable
        rows={allObjects}
        selectOneObjectForInfo={selectOneObjectForInfo}
        selectOneObjectForTable={selectOneObjectForTable}
      />
      {oneObject?.Sensor?.length > 0 && (
        <Box sx={{marginY: 2}}>
          <AboutObjectPaginationAndSelectForTable
            openAddInfoAboutSensors={openAddInfoAboutSensors}
            rows={oneObject?.Sensor || []}
            onSelectedSensors={onSelectedSensors}
          />
          <Grid container spacing={3} sx={{marginY: 2}} display="flex" justifyContent="center">
            <Grid md={3} xs={12} display="flex" justifyContent="center">
              <Button variant="contained" disabled={selectedSensors?.length === 0} sx={{width: 300, marginTop: 1}}
                      onClick={showMainCharts}>
                Диаграмма
              </Button>
            </Grid>

            <Grid md={3} xs={12} display="flex" justifyContent="center">
              <Button variant="contained" disabled={selectedSensors?.length === 0} sx={{width: 300, marginTop: 1}}
                      onClick={showDynamicCharts}>
                Динамический график
              </Button>
            </Grid>
            <Grid md={3} xs={12} display="flex" justifyContent="center">
              <Button variant="contained" sx={{width: 300, marginTop: 1}} disabled={selectedSensors?.length === 0}
                      onClick={showLineCharts}>
                Построить линейный график
              </Button>
            </Grid>
          </Grid>
          {chartsData.length > 0 && visibleChart ? <Box>
            <MainVictoryBarChart data={chartsData}/>
            <Box display="flex" justifyContent="center">
              <Button variant="contained" sx={{width: 300, marginTop: 1}} onClick={hideMainCharts}>
                Скрыть диаграмму
              </Button>
            </Box>
          </Box> : null}
        </Box>
      )}
      {dataDynamicChartsData.length > 0 && visibleDynamicChart ? <Box>
        <AreaVictoryChart sensors={dataDynamicChartsData}/>
        <Box display="flex" justifyContent="center">
          <Button variant="contained" sx={{width: 300, marginTop: 1}} onClick={hideDynamicCharts}>
            Скрыть динамические графики
          </Button>
        </Box>
      </Box> : null
      }
      <ModalDataObject
        isOpen={isOpenDataObject}
        onCloseOut={closeDataObject}
        dataObject={isSelectObject}
      />
      <ModalForAdditionalDataSensors
        isOpenModalAddData={isOpenModalAddData}
        onClose={closeModalAddData}
        mainUser={mainUser!}/>
    </Stack>
  );
}
