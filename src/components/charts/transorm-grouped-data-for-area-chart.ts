import { transformCode } from "@/components/charts/transform-grouped-data-for-apex";
import dayjs from "dayjs";

// Типы данных для функции
interface SensorInfo {
  sensor_type: string;
  model: string;
  designation: string;
  network_number: number;
  requestSensorInfo?: {
    min_base: number;
    max_base: number;
    base_zero: number;
  }[];
  additional_sensor_info?: {
    coefficient: number;
    limitValue: number;
  }[];
}

interface SensorData {
  id: number;
  sensor_id: string;
  request_code: string;
  answer_code: string;
  created_at: string;
  sensor: SensorInfo;
}

interface GroupedData {
  sensorId: string;
  data: SensorData[];
}

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

// Функция для генерации случайного цвета в формате HEX
function generateRandomColor(): string {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
}

export default async function transformGroupedDataForAreaVictory(
  groupedData: GroupedData[] | undefined
): Promise<TransformedData[]> {
  const transformedDataArray: TransformedData[] = [];

  if (groupedData) {
    for (const group of groupedData) {
      const { sensorId, data } = group;

      let lastValidValue: number | null = null;
      const sensorData: { x: string; y: number }[] = [];

      for (let i = 0; i < 10; i++) {
        const entry = data[i];

        if (entry) {
          const {
            sensor: { model, additional_sensor_info, requestSensorInfo },
            answer_code,
            created_at,
          } = entry;

          const coefficient: number = additional_sensor_info?.[0]?.coefficient ?? 1;
          const limitValue: number = additional_sensor_info?.[0]?.limitValue ?? 3000;
          const formattedDate = dayjs(created_at).format('DD-MM-YYYY HH.mm.ss');
          const transformedCode = await transformCode(answer_code, model, coefficient, limitValue);
          const sensorZero: number = data[0].sensor.requestSensorInfo?.[0]?.base_zero ?? 0;
          let y: number;
          if (typeof transformedCode === "number") {
            const roundedValue = Math.round((transformedCode + Number.EPSILON) * 100) / 100; // Округляем до 2 знаков после запятой
            y = Math.abs(roundedValue) >= limitValue ? lastValidValue  ?? 0 : roundedValue;
            y = y - sensorZero
          } else {
            y = lastValidValue ?? 0;
          }

          lastValidValue = y;
          sensorData.push({ x: formattedDate, y });
        } else {
          const lastEntryDate = data[i - 1]?.created_at || new Date().toISOString();
          const formattedDate = dayjs(lastEntryDate).format('DD-MM-YYYY HH.mm.ss');
          sensorData.push({ x: formattedDate, y: lastValidValue ?? 0 });
        }
      }

      sensorData.sort((a, b) => (a.x < b.x ? -1 : a.x > b.x ? 1 : 0));

      if (data.length > 0) {
        const {
          sensor: { sensor_type, model, designation, network_number },
        } = data[0];

        const sensorZero: number = data[0].sensor.requestSensorInfo?.[0]?.base_zero ?? 0;

        if(sensorZero === 0 ) {
          transformedDataArray.push({
            sensorId,
            sensorName: `${sensor_type} | ${model}`,
            sensorLocation: `${designation} | ${network_number}`,
            sensorColor: "#0476d3",
            sensorMin: (data[0].sensor.requestSensorInfo?.[0]?.min_base ?? 0),
            sensorMax: (data[0].sensor.requestSensorInfo?.[0]?.max_base ?? 3000),
            sensorZero, // Сохраняем sensorZero в объекте
            sensorData,
          });
        } else {
          transformedDataArray.push({
            sensorId,
            sensorName: `${sensor_type} | ${model}`,
            sensorLocation: `${designation} | ${network_number}`,
            sensorColor: "#0476d3",
            sensorMin: 0,
            sensorMax:0,
            sensorZero,
            sensorData,
          });
        }
      }
    }
  }

  return transformedDataArray;
}
