"use client";
import * as React from 'react';
import { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import SensorsShowForChartsTable from "@/components/tables/sensors-show-for-charts-table";
import Box from "@mui/material/Box";
import { MObject } from "@/types/common-types";
import { addSelectedSensor } from "@/store/selected-sensor-reducer";
import AllObjectsPaginationActionsTable from "@/components/tables/all-objects-pagination-actions-table";
import Button from "@mui/material/Button";
import ModalForAdditionalDataSensors from "@/components/dashboard/additional-data-sensor/modal-for-additional-data-sensors";
import { sensorsDataClient } from "@/components/dashboard/additional-data-sensor/sensors-data-client";
import MainVictoryBarChart from "@/components/charts/victory/main-victory-charts";
import { addSelectedObjects } from "@/store/selected-objects-reducer";
import { transformToChartData } from "@/components/charts/transform-to-chart-data";
import { Grid } from "@mui/material";
import { VictoryChartData } from "@/types/victory-chart-data";
import {ApiResult} from "@/types/result-api"; // Убедитесь, что тип VictoryChartData определен

export default function Page(): React.JSX.Element {
  const allObjects = useSelector((state: RootState) => state.allObjects.value);
  const [selectedObjects, setSelectedObjects] = useState<MObject[]>([]);
  const [selectedObjectsForShow, setSelectedObjectsForShow] = useState<MObject[]>([]);
  const [isOpenModalAddData, setIsOpenModalAddData] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const dispatch: AppDispatch = useDispatch();
  const [chartsData, setChartsData] = useState<Record<string, VictoryChartData[]>>({});
  const [visibleCharts, setVisibleCharts] = useState<Set<string>>(new Set());

  async function onSelectedRowsChange(selected: Set<string>) {
    try {
      const selectedArray = Array.from(selected);
      const selectedObjects = allObjects.filter(object => selectedArray.includes(object.id));
      setSelectedObjectsForShow(selectedObjects);
      const result:ApiResult = await sensorsDataClient.getLastValuesDataForSelectedSensors(selectedArray);
      if (result?.statusCode === 200) {
        dispatch(addSelectedObjects(result?.selectedObjects || []));
      } else {
        console.error("Ошибка получения данных сенсоров");
      }
    } catch (error) {
      console.error("Ошибка в onSelectedRowsChange:", error);
    }
  }

  async function openAddInfoAboutSensors(sensor_id: string) {
    try {
      dispatch(addSelectedSensor(sensor_id));
      setIsOpenModalAddData(true);
    } catch (error) {
      console.error("Ошибка открытия дополнительной информации о сенсорах:", error);
    }
  }

  useEffect(() => {
    const selectedObjects = allObjects.filter(obj => Array.isArray(obj.Sensor) && obj.Sensor.length > 0);
    setSelectedObjects(selectedObjects);
  }, [allObjects]);

  const openMainCharts = async (id: string) => {
    try {
      const oneObject = selectedObjects.find(obj => obj.id === id);
      if (oneObject) {
        const dataForCharts = await transformToChartData(oneObject);

        if (Array.isArray(dataForCharts)) {
          setChartsData(prevState => ({
            ...prevState,
            [id]: dataForCharts
          }));
          setVisibleCharts(prevState => new Set(prevState.add(id))); // Показать график
        } else {
          console.error("Ожидался массив данных для гистограммы, но был получен другой тип.");
          setChartsData(prevState => ({
            ...prevState,
            [id]: []
          }));
        }
      }
    } catch (error) {
      console.error("Ошибка загрузки данных для гистограммы:", error);
      setChartsData(prevState => ({
        ...prevState,
        [id]: []
      }));
    }
  };

  const hideMainCharts = (id: string) => {
    setVisibleCharts(prevState => {
      const newSet = new Set(prevState);
      newSet.delete(id); // Удалить id из видимых графиков
      return newSet;
    });
  };

  const openLargeCharts = (id: string) => {
    console.log(id);
  };

  const closeModalAddData = () => {
    setIsOpenModalAddData(false);
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Объекты</Typography>
      <AllObjectsPaginationActionsTable rows={selectedObjects} onSelectedRowsChange={onSelectedRowsChange} />
      {selectedObjectsForShow.length > 0 ? (
        <Box>
          {selectedObjectsForShow.map((item: MObject) => (
            <Box key={item.id} sx={{ marginY: 2 }}>
              <Typography variant="h5">
                Объект: <span style={{ fontWeight: 400 }}>{item.name} ({item.address})</span>
              </Typography>
              <SensorsShowForChartsTable
                openAddInfoAboutSensors={openAddInfoAboutSensors}
                rows={item.Sensor}
                page={page}
                setPage={setPage}
              />
              <Typography variant="body1" sx={{ marginY: 2 }}>Для данного объекта загрузить гистограмму</Typography>
              <Grid container spacing={3} sx={{ marginY: 2 }} display="flex" justifyContent="center">
                <Grid md={4} xs={12} display="flex" justifyContent="center">
                  <Button variant="contained" onClick={() => openMainCharts(item.id)} sx={{ width: 260, marginTop: 1 }}>
                    Загрузить гистограмму
                  </Button>
                </Grid>
                <Grid md={4} xs={12} display="flex" justifyContent="center">
                  <Button variant="contained" onClick={() => hideMainCharts(item.id)} sx={{ width: 260, marginTop: 1 }}>
                    Скрыть гистограмму
                  </Button>
                </Grid>
                <Grid md={4} xs={12} display="flex" justifyContent="center">
                  <Button variant="contained" onClick={() => openLargeCharts(item.id)} sx={{ width: 260, marginTop: 1 }}>
                    Отобразить графики
                  </Button>
                </Grid>
              </Grid>
              {/* Отображаем график, если данные для этого объекта существуют и график видим */}
              {chartsData[item.id] && visibleCharts.has(item.id) && (
                <MainVictoryBarChart data={chartsData[item.id]} />
              )}
            </Box>
          ))}
        </Box>
      ) : (
        <Typography variant="body1">
          Для отображения датчиков выберите объект
        </Typography>
      )}
      <ModalForAdditionalDataSensors isOpenModalAddData={isOpenModalAddData} onClose={closeModalAddData} />
    </Stack>
  );
}
