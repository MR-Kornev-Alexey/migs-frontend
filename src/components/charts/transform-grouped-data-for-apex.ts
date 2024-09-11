import dayjs from 'dayjs';
import parseSensorRf251 from "@/lib/parse-sensor/parse-sensor-rf251";
import parseSensorInD3 from "@/lib/parse-sensor/parse-sensor-in-d3";
import hexToAsciiAndConvert from "@/lib/parse-sensor/hex-to-ascii-and-convert-for-ls5";

// Функция для преобразования кода ответа в зависимости от модели сенсора
export async function transformCode(answerCode: string, model: string, coefficient: number, limitValue: number): Promise<string | number> {
  try {
    switch (model) {
      case 'ИН-Д3':
        return parseSensorInD3(answerCode, coefficient, limitValue).magnitude;
      case 'РФ-251':
        return parseSensorRf251(answerCode, coefficient, limitValue).distance;
      case 'LS5':
        return hexToAsciiAndConvert(answerCode, coefficient, limitValue);
      default:
        return 'ошибка';
    }
  } catch (error) {
    console.error(`Error transforming code for model ${model}:`, error);
    return '';
  }
}

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
    requestSensorInfo: {
      base_zero: number;
    }[];
    additional_sensor_info: {
      coefficient: number;
      limitValue: number;
    }[];
  };
}

interface RawSensorData {
  sensorName: string;
  sensorLocation: string;
  sensorZero: number; // Добавлено поле sensorZero
  labels: string[];
  data: number[];
}

// Функция для преобразования и группировки данных
export default async function transformGroupedDataForApex(groupedData: GroupedData[] | undefined): Promise<RawSensorData[]> {
  const sensorMap = new Map<string, { sensorName: string; sensorLocation: string; sensorZero: number; labels: string[]; data: number[] }>();

  if (groupedData) {
    for (const entry of groupedData) {
      const {
        sensor: { sensor_type, model, designation, network_number, requestSensorInfo, additional_sensor_info },
        created_at,
        answer_code,
      } = entry;

      // Предполагается, что coefficient находится в первом элементе additional_sensor_info
      const coefficient = additional_sensor_info[0]?.coefficient ?? 1;
      const limitValue = additional_sensor_info[0]?.limitValue ?? 3000;
      const sensorZero: number = requestSensorInfo?.[0]?.base_zero ?? 0;

      const sensorName = `${sensor_type}  |   ${model}`;
      const sensorLocation = `${designation} |  ${network_number}`;
      const formattedDate = dayjs(created_at).format('DD-MM-YYYY HH.mm.ss');

      const transformedCode = await transformCode(answer_code, model, coefficient, limitValue);

      // Пропускаем, если значение null или ошибка
      if (transformedCode === null || transformedCode === 'ошибка') {
        continue;
      }

      if (!sensorMap.has(entry.sensor_id)) {
        sensorMap.set(entry.sensor_id, { sensorName, sensorLocation, sensorZero, labels: [], data: [] });
      }

      // Добавляем данные в соответствующий объект
      const sensorData = sensorMap.get(entry.sensor_id);
      if (sensorData) {
        sensorData.labels.push(formattedDate);
        if (typeof transformedCode === "number") {
          sensorData.data.push(transformedCode - sensorZero); // Вычитаем sensorZero
        }
      }
    }
  }

  // Преобразуем sensorMap в массив объектов RawSensorData
  const result: RawSensorData[] = [];

  sensorMap.forEach(({ sensorName, sensorLocation, sensorZero, labels, data }) => {
    // Удаляем элементы, если data[i] равна null
    const filteredData = data.filter((value) => value !== null);
    const filteredLabels = labels.filter((_, index) => data[index] !== null);

    result.push({
      sensorName,
      sensorLocation,
      sensorZero, // Добавляем sensorZero в итоговый объект
      labels: filteredLabels,
      data: filteredData,
    });
  });

  return result;
}
