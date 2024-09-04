type SensorData = {
  x: number;
  y: number;
};

type ProcessedSensor = {
  sensorId: string;
  sensorName: string;
  sensorLocation: string;
  sensorColor: string;
  sensorData: SensorData[];
};

function generateRandomColor(): string {
  // Генерация случайного цвета в формате #RRGGBB
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default async function createSeriesForDynamicCharts(selectedObject: any): Promise<ProcessedSensor[]> {
  const processedSensors: ProcessedSensor[] = [];

  if (selectedObject?.Sensor) {
    for (const sensor of selectedObject.Sensor) {
      const sensorId = sensor.id
      const sensorName = `${sensor.model}`;
      const sensorLocation = `${sensor.designation} | ${sensor.network_number}`;
      const sensorColor = generateRandomColor();

      const lastBaseValue = sensor.requestSensorInfo[0]?.last_base_value || 0;
      const baseZero = sensor.requestSensorInfo[0]?.base_zero || 0;
      const yValue = selectedObject.set_null ? lastBaseValue - baseZero : lastBaseValue;

      // Массив с 5 объектами, где x изменяется, а y дублируется
      const sensorData = Array.from({ length: 5 }, (_, index) => ({
        x: index + 1,
        y: yValue,
      }));

      processedSensors.push({
        sensorId,
        sensorName,
        sensorLocation,
        sensorColor,
        sensorData,
      });
    }
  }

  return processedSensors;
}
