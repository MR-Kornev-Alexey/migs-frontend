import dayjs from 'dayjs';
import parseSensorRf251 from "@/lib/parse-sensor/parse-sensor-rf251";
import parseSensorInD3 from "@/lib/parse-sensor/parse-sensor-in-d3";
import hexToAsciiAndConvert from "@/lib/parse-sensor/hex-to-ascii-and-convert-for-ls5";
import {transformCode} from "@/components/charts/transform-grouped-data-for-apex";



// Типизация данных
interface GroupedData {
  id: number;
  sensor_id: string;
  request_code: string;
  answer_code: string;
  created_at: string;
  sensor: {
    id: string;
    object_id: string;
    sensor_type: string;
    sensor_key: string;
    model: string;
    ip_address: string;
    designation: string;
    network_number: number;
    notation: string;
    run: boolean;
    additional_sensor_info: {
      coefficient: number;
    };
  };
}

interface SensorData {
  sensorName: string;
  sensorLocation: string;
  dataForCharts: { x: string; y: number | string }[];
}

// Функция для преобразования и группировки данных
export default async function transformGroupedData(groupedData: any[] | undefined): Promise<SensorData[]> {
  // Группируем данные по датчику (sensor_id)
  const sensorMap = new Map<string, SensorData>();

  if (groupedData) {
    for (const entry of groupedData) {
      const {
        sensor: {sensor_type, model, designation, network_number, additional_sensor_info},
        created_at,
        answer_code,
      } = entry;
      const coefficient = additional_sensor_info[0].coefficient;
      const limitValue = additional_sensor_info[0].limitValue;
      // Формирование имени сенсора и его местоположения
      const sensorName = `${sensor_type}  |   ${model}`;
      const sensorLocation = `${designation} |  ${network_number}`;

      // Форматирование даты
      const formattedDate = dayjs(created_at).format('DD-MM-YYYY HH.mm.ss');

      // Применяем функцию transformCode для обработки answer_code
      const transformedCode = await transformCode(answer_code, model, coefficient, limitValue);

      // Пропускаем добавление, если transformedCode равно null
      if (transformedCode === null || transformedCode === 'ошибка') {
        continue; // Продолжаем цикл, не добавляем этот элемент
      }

      if (!sensorMap.has(entry.sensor_id)) {
        sensorMap.set(entry.sensor_id, {
          sensorName,
          sensorLocation,
          dataForCharts: [],
        });
      }

      // Добавляем данные для графиков
      sensorMap.get(entry.sensor_id)?.dataForCharts.push({
        x: formattedDate,
        y: transformedCode,
      });
    }
  }

  // Преобразуем Map в массив и сортируем по model
  return Array.from(sensorMap.values()).sort((a, b) =>
    a.sensorName.localeCompare(b.sensorName)
  );
}
