import { MObject } from '@/types/common-types';
import calculateColorForCharts from '@/components/charts/calculate-color-for-charts'; // Ensure the path is correct

interface SensorInfo {
  last_base_value?: number;
  min_base?: number;
  max_base?: number;
  base_zero?: number;
}

interface AdditionalInfo {
  limitValue?: number;
}

interface Sensor {
  requestSensorInfo?: SensorInfo[];
  additional_sensor_info?: AdditionalInfo[];
  sensor_type: string;
  network_number: string;
}

export async function transformToChartData(object: MObject): Promise<{
  color: string;
  x: string;
  y: number;
}[]> {
  const chartData: { color: string; x: string; y: number }[] = [];

  for (const sensor of object.Sensor) {
    const requestSensorInfo = sensor.requestSensorInfo?.[0]; // Check existence of requestSensorInfo
    const additionalInfo = sensor.additional_sensor_info?.[0]; // Check existence of additional_sensor_info

    if (!requestSensorInfo || !additionalInfo) {
      chartData.push({
        x: `${sensor.sensor_type} ${sensor.network_number}`,
        y: 0,
        color: '#4b4a4a' // Default gray color
      });
      continue;
    }

    const { last_base_value, min_base, max_base, base_zero } = requestSensorInfo;
    const { limitValue } = additionalInfo;

    let y: number;
    if (last_base_value !== undefined && base_zero !== undefined) {
      y = object.set_null ? (last_base_value - base_zero) : last_base_value;
    } else {
      y = 0;
    }

    const color = calculateColorForCharts(max_base, last_base_value, min_base, limitValue);

    chartData.push({
      x: `${sensor.sensor_type} ${sensor.network_number}`,
      y,
      color
    });
  }

  // Sorting by sensor_type and network_number
  chartData.sort((a, b) => {
    // First, sort by sensor_type
    const typeComparison = a.x.localeCompare(b.x);
    if (typeComparison !== 0) {
      return typeComparison;
    }
    // If sensor_type is the same, sort by network_number (extracting the numeric part)
    const aNumber = parseFloat(a.x.split(' ')[1]);
    const bNumber = parseFloat(b.x.split(' ')[1]);
    return aNumber - bNumber;
  });

  return chartData;
}
