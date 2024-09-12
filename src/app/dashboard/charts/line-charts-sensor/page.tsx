"use client"
import * as React from 'react';
import {useEffect, useState} from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import dynamic from 'next/dynamic';
import {useSelector} from "react-redux";
import type {RootState} from "@/store/store";
import type {ApiResult} from "@/types/result-api";
import {sensorsDataClient} from "@/components/dashboard/additional-data-sensor/sensors-data-client";
import transformGroupedDataForApex from "@/components/charts/transform-grouped-data-for-apex";
import SelectTimePeriod from "@/components/select/select-time-period";
import Box from "@mui/material/Box";
import {useRouter} from "next/navigation";
import Button from "@mui/material/Button";
import {SvgSpinnersEclipseHalf} from "@/components/animated-icon/eclipse-half";
import {Grid} from "@mui/material";

const LineApexChart = dynamic(() => import('@/components/charts/apex/line-apex-chart'), {ssr: false});

interface Period {
  startDate: string;
  endDate: string;
}

export default function Page(): React.JSX.Element {
  const selectedSensors = useSelector((state: RootState) => state.selectedSensorsForCharts.value);
  const oneSelectObject = useSelector((state: RootState) => state.selectedObjectForCharts.value);
  const [isSetOneHour, setOneHour] = useState<boolean>(false);
  const [lineChartsData, setLineChartsData] = useState<any[]>([]);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isPeriod, setIsPeriod] = useState<never[]>([]);

  const router = useRouter();

  const setIsPeriodAndCreateCharts = async (period: never[]) => {
    setIsPeriod(period)
  };

  const startCreateOfCharts = async () => {
    setIsPending(true)
    const transformedData = await showAndCreateLineCharts(isPeriod);
    if (transformedData) {
      setLineChartsData(transformedData);
    }
    setIsPending(false); // Окончание загрузки — скрываем спиннер
  }
  const showAndCreateLineCharts = async (period: Period[]) => {
    if (!oneSelectObject || !selectedSensors.length) return;
    const sendData = {
      objectsId: oneSelectObject.length > 0 ? oneSelectObject[0].id : null,
      selectedSensors,
      period,
    };
    const result: ApiResult = await sensorsDataClient.getGroupedDataForSelectedObject(sendData);
    if (result?.data?.statusCode === 200) {
      return await transformGroupedDataForApex(result?.data?.groupedData);
    }
  };

  useEffect(() => {
    if (!oneSelectObject || !selectedSensors.length) {
      router.push('/dashboard/charts');
    }
  }, []);

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Формирование линейных графиков</Typography>
        <Typography variant="body1" sx={{ marginY: 2 }}>
          Для формирование линейных графиков выбегите период
        </Typography>
        <SelectTimePeriod setPeriodToParent={setIsPeriodAndCreateCharts} setOneHour={setOneHour} />
      </Box>

      <Grid container spacing={3} sx={{marginY: 2}} display="flex" justifyContent="center">
        <Grid md={6} xs={12} display="flex" justifyContent="left">
          <Button
            variant="contained"
            sx={{ width: 260 }}
            onClick={startCreateOfCharts}
          >
            Загрузить
          </Button>
        </Grid>
        <Grid md={6} xs={12} display="flex" justifyContent="left">
          <Button
            variant="contained"
            sx={{ width: 260 }}
            onClick={() => {
              router.push('/dashboard/charts');
            }}
          >
            Назад
          </Button>
        </Grid>
      </Grid>
      {/* Показ спиннера во время загрузки */}
      {isPending ? (
        <Box display="flex" justifyContent="center" alignItems="center">
          <SvgSpinnersEclipseHalf />
        </Box>
      ) : (
        <Box>
          {lineChartsData.length > 0 && (
            <Box>
              {lineChartsData.map((item: any, index: number) => (
                <Box key={index}>
                  <Typography variant="body1">
                    {item.sensorName} {item.sensorLocation}
                  </Typography>
                  {item.sensorZero !== 0 &&
                    <Typography variant="body1">
                      логический ноль:  {item.sensorZero} мкм.
                    </Typography>
                  }
                  <LineApexChart series={item.data} labels={item.labels} />
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}
    </Stack>
  );
}
