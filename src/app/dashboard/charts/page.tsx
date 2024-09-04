"use client"

import React, {useState, useEffect, Dispatch, SetStateAction} from 'react';
import {Box, Button, Grid, Stack, Typography} from '@mui/material';
import {useDispatch, useSelector} from "react-redux";
import {type AppDispatch, type RootState} from '@/store/store';
import AllObjectsPaginationSelectTable from "@/components/tables/all-objects-pagination-select-table";
import type {MObject, NewSensor} from "@/types/common-types";
import {addSelectedObjects, clearSelectedObjects} from "@/store/selected-objects-reducer";
import AboutObjectPaginationAndSelectForTable from "@/components/tables/sensors-pagination-and-select-table-for-tables";
import {addSelectedSensor, clearSelectedSensors} from "@/store/selected-sensor-reducer";
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
import {DataFromSensor} from "@/types/common-types";
import parseSensorInD3 from "@/lib/parse-sensor/parse-sensor-in-d3";
import parseSensorRf251 from "@/lib/parse-sensor/parse-sensor-rf251";
import hexToAsciiAndConvert from "@/lib/parse-sensor/hex-to-ascii-and-convert-for-ls5";
import {SensorInfo} from "@/types/sensor";
import AreaVictoryChart from "@/components/charts/victory/area-victory-charts";
import transformGroupedDataForAreaVictory from "@/components/charts/transorm-grouped-data-for-area-chart";
import dayjs from "dayjs";

type SensorData = {
  x: string;
  y: number;
};

type SelectedSensor = {
  sensorId: string;
  sensorName: string;
  sensorLocation: string;
  sensorColor: string;
  sensorData: SensorData[];
};

type Input = {
  sensorId: string;
  valueY: number;
};

export default function Page(): React.JSX.Element {
  const [isOpenModalCreateData, setIsOpenModalCreateData] = useState<boolean>(false);
  const allObjects = useSelector((state: RootState) => state.allObjects.value);
  const allSensors = useSelector((state: RootState) => state.allSensors.value);
  const [isOpenDataObject, setIsOpenDataObject] = useState<boolean>(false);
  const [isSelectObject, setIsSelectObject] = useState<MObject | undefined>();
  const dispatch: AppDispatch = useDispatch();
  const [selectedSensors, setSelectedSensors] = useState<any[]>([]);
  const [isOpenModalAddData, setIsOpenModalAddData] = useState<boolean>(false);
  const [visibleChart, setVisibleChart] = useState<boolean>(false);
  const [visibleDynamicChart, setVisibleDynamicChart] = useState<boolean>(false);
  const oneObject = useSelector((state: RootState) => state.selectedObjects.value[0]);
  const [selectedObjects, setSelectedObjects] = useState<MObject[]>([]);
  const [isResultFromApi, setIsResultFromApi] = useState<any[]>([]);
  const [isTerminalRunning, setIsTerminalRunning] = useState(false);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const [chartsData, setChartsData] = useState<VictoryChartData[]>([]);
  const [dataDynamicChartsData, setDynamicChartsData] = useState<any[]>([]);
  const router = useRouter();
  const onSelectedSensors = (sensorsId: Set<any>) => {
    setSelectedSensors(Array.from(sensorsId));
  };

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

      const selectedObject = allObjects.find((object) => object.id === selectedId);
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
      setSelectedObjects([]);
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
    dispatch(addSelectedSensorsForCharts(selectedSensors));
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
        console.log('result?.data?.groupedData:', result?.data?.groupedData);
        const createdDataForDynamicCharts = await transformGroupedDataForAreaVictory(result?.data?.groupedData);
        console.log('Initial data for dynamic charts:', createdDataForDynamicCharts);
        setDynamicChartsData(createdDataForDynamicCharts);
      }
    };
    newEventSource.onerror = (error) => {
      console.error('EventSource error:', error);
      newEventSource.close();
      setIsTerminalRunning(false);
    };
    setIsTerminalRunning(true);
  }

//   const convertSSEDataToNumber = async (inputData: DataFromSensor) => {
//     const foundSensor = allSensors.find(sensor => sensor.id === inputData.sensor_id);
//     const coefficient = foundSensor.additional_sensor_info[0]?.coefficient ?? 1;
//     const limitValue = foundSensor.additional_sensor_info[0]?.limitValue ?? 6000;
//     const formattedDate = dayjs(inputData.created_at).format('DD-MM-YYYY HH.mm.ss');
//
//     let transformedCode;
//     switch (foundSensor.model) {
//       case 'ИН-Д3':
//         transformedCode = parseSensorInD3(inputData.answer_code, coefficient, limitValue).magnitude;
//         break;
//       case 'РФ-251':
//         transformedCode = parseSensorRf251(inputData.answer_code, coefficient, limitValue).distance;
//         break;
//       case 'LS5':
//         transformedCode = hexToAsciiAndConvert(inputData.answer_code, coefficient, limitValue);
//         break;
//       default:
//         transformedCode = '';
//     }
//     console.log('transformedCode ---', transformedCode)
//     if (transformedCode !== "ошибка" && transformedCode) {
//       const newData = {
//         sensorId: inputData.sensor_id,
//         data: {
//           x: formattedDate,
//           y: transformedCode
//         }
//       };
//       console.log('newData ---', newData)
//       console.log('dataDynamicChartsData ---', dataDynamicChartsData)
//       if (dataDynamicChartsData.length > 0) {
//         const updatedDataForCharts = await updateSensorData(dataDynamicChartsData, newData);
//         console.log('updatedDataForCharts ---', updatedDataForCharts);
//         setDynamicChartsData(updatedDataForCharts);
//       }
//     }
//   };
//
// // Обновление данных для всех сенсоров
//   async function updateSensorData(
//     selectedSensors: SelectedSensor[],
//     input: { data: { x: string; y: number }; sensorId: string }
//   ): Promise<SelectedSensor[]> {
//     // Обновляем данные для всех сенсоров
//     console.log("selectedSensors ---", selectedSensors)
//     return selectedSensors.map(sensor => {
//       // Если сенсор соответствует input.sensorId, обновляем его данные
//       if (sensor.sensorId === input.sensorId) {
//         // Сдвигаем все элементы графика влево
//         const updatedSensorData = sensor.sensorData
//           .slice(1) // Убираем первый элемент (самый старый)
//           .concat(input.data); // Добавляем новый элемент в конец
//         updatedSensorData.sort((a, b) => dayjs(a.x).isAfter(dayjs(b.x)) ? -1 : 1);
//         console.log('updatedSensorData --- ', updatedSensorData)
//         return {
//           ...sensor,
//           sensorData: updatedSensorData,
//         };
//       }
//       // Если sensorId не совпадает, возвращаем сенсор без изменений
//
//       return sensor;
//     });
//   }



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
        <AreaVictoryChart sensors={dataDynamicChartsData} />
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
      />
    </Stack>
  );
}
