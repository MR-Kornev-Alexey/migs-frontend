interface Sensor {
  model: string;
  network_number: string;
  designation: string;
  sensor_key: string;
  sensor_type: string;
  additional_sensor_info: {
    coefficient: number;
    limitValue: number;
  }[];
}

interface SensorDataItem {
  sensor: Sensor;
  request_code: string;
  answer_code: string;
  created_at: string;
}

interface GroupedSensorData {
  model: string;
  network_number: string;
  designation: string;
  sensor_key: string;
  sensor_type: string;
  coefficient:number;
  limitValue: number,
  data: {
    request_code: string;
    answer_code: string;
    created_at: string;
  }[];
}


export default async function groupAndSortSensorData(sensorData: SensorDataItem[] | undefined): Promise<GroupedSensorData[]> {
  if (!sensorData) {
    return [];
  }
  // Группируем данные по модели сенсора, номеру сети и обозначению
  const groupedData = sensorData.reduce<Record<string, GroupedSensorData>>((acc, item) => {
    const { model, network_number, designation, sensor_key, sensor_type } = item.sensor;
    const key = `${model}-${network_number}-${designation}`;
    const coefficient = item?.sensor?.additional_sensor_info[0]?.coefficient ?? 1;
    const limitValue = item?.sensor?.additional_sensor_info[0]?.limitValue ?? 3000; // Установил значение по умолчанию
    // Если ключ еще не существует, создаем его
    if (!acc[key]) {
      acc[key] = {
        model,
        network_number,
        designation,
        sensor_key,
        sensor_type,
        coefficient,
        limitValue,
        data: [],
      };
    }

    // Добавляем данные сенсора в массив
    acc[key].data.push({
      request_code: item.request_code,
      answer_code: item.answer_code,
      created_at: item.created_at,
    });

    return acc;
  }, {});

  // Преобразуем объект в массив, сортируем группы и внутри каждой группы сортируем данные
  return Object.values(groupedData)
    .map(group => ({
      ...group,
      data: group.data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    }))
    .sort((a, b) => a.model.localeCompare(b.model));
}
