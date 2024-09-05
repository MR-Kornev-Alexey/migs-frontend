import { transformCode } from "@/components/charts/transform-grouped-data-for-apex";
import dayjs from "dayjs";

// Типы данных для функции
interface SensorInfo {
  sensor_type: string;
  model: string;
  designation: string;
  network_number: number;
  additional_sensor_info: {
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
  sensorData: { x: string; y: number }[]; // Изменил тип x на string
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
      const sensorData: { x: string; y: number }[] = []; // Изменил тип x на string

      // Создаем данные с последовательными значениями x от 1 до 10
      for (let i = 0; i < 10; i++) {
        const entry = data[i]; // Получаем данные для текущего индекса

        if (entry) {
          const {
            sensor: { sensor_type, model, additional_sensor_info },
            answer_code,
            created_at
          } = entry;

          const coefficient = additional_sensor_info[0]?.coefficient ?? 1;
          const limitValue = additional_sensor_info[0]?.limitValue ?? 0; // Установил значение по умолчанию
          const formattedDate = dayjs(created_at).format('DD-MM-YYYY HH.mm.ss');
          const transformedCode = await transformCode(answer_code, model, coefficient, limitValue);

          // Если transformedCode не определен или ошибка, используем предыдущее значение
          let y: number;
          if (typeof transformedCode === "number") {
            y = Math.abs(transformedCode) >= limitValue
              ? lastValidValue ?? 0
              : transformedCode;
          } else {
            y = lastValidValue ?? 0;  // Если transformedCode не число или "ошибка", используем lastValidValue
          }

          lastValidValue = y; // Обновляем предыдущее значение

          sensorData.push({ x: formattedDate, y });
        } else {
          // Если данных нет для текущего индекса, используем предыдущее значение
          const lastEntryDate = data[i - 1]?.created_at || new Date().toISOString();
          const formattedDate = dayjs(lastEntryDate).format('DD-MM-YYYY HH.mm.ss');
          sensorData.push({ x: formattedDate, y: lastValidValue ?? 0 });
        }
      }

      // Сортировка sensorData по значению x (дате) в порядке возрастания
      sensorData.sort((a, b) => dayjs(a.x).isBefore(dayjs(b.x)) ? -1 : 1);


      // Проверяем, есть ли данные в массиве data перед использованием data[0]
      if (data.length > 0) {
        const {
          sensor: { sensor_type, model, designation, network_number },
        } = data[0]; // Используем данные из первой записи для имени и локации сенсора

        transformedDataArray.push({
          sensorId,
          sensorName: `${sensor_type} | ${model}`,
          sensorLocation: `${designation} | ${network_number}`,
          // sensorColor: generateRandomColor(),
          sensorColor: "#0476d3",
          sensorData,
        });
      }
    }
  }

  return transformedDataArray;
}
