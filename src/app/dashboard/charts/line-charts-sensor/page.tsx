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

const LineApexChart = dynamic(() => import('@/components/charts/apex/line-apex-chart'), {ssr: false});

interface Period {
  startDate: string;
  endDate: string;
}

export default function Page(): React.JSX.Element {
 const selectedSensors = useSelector((state: RootState) => state.selectedSensorsForCharts.value);
  const oneObject = useSelector((state: RootState) => state.selectedObjects.value[0]);
  const [isPeriod, setIsPeriod] = useState<Period | null>(null);
  const [isSetOneHour, setOneHour] = useState<boolean>(false);
  const [lineChartsData, setLineChartsData] = useState<any[]>([]);
  const router = useRouter();
  const setIsPeriodAndCreateCharts = async (period: any) => {
    setIsPeriod(period);
    const transformedData = await showAndCreateLineCharts(period)
    if (transformedData) {
      setLineChartsData(transformedData);
    } else {

    }
  }
  const showAndCreateLineCharts = async (period:any) => {
    if (!oneObject || !selectedSensors.length) return;
    const sendData = {
      objectsId: oneObject.id,
      selectedSensors: selectedSensors,
      period: period
    }
    const result: ApiResult = await sensorsDataClient.getGroupedDataForSelectedObject(sendData);
    if (result?.data?.statusCode === 200) {
      return await transformGroupedDataForApex(result?.data?.groupedData)
    }
  };

  useEffect(() => {
    if (!oneObject || !selectedSensors.length)
      router.push('/dashboard/charts');
  }, []);
  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Формирование линейных графиков</Typography>
        <Typography variant="body1" sx={{marginY: 2 }}>Для формирование линейных графиков выбегите период</Typography>
        <SelectTimePeriod setPeriodToParent={setIsPeriodAndCreateCharts} setOneHour={setOneHour}/>
      </Box>
      <Box>
        {lineChartsData.length > 0 && (
          <Box>
            {lineChartsData.map((item: any, index: number) => (
              <Box key={index}>
                <Typography variant="h6">{item.sensorName} {item.sensorLocation}</Typography>
                <LineApexChart series={item.data} labels={item.labels}/>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Stack>
  );
}