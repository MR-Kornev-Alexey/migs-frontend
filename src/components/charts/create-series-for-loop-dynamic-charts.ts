
type ProcessedSensor = {
  sensorId: string;
  yValue:number
};

export default async function createSeriesForLoopDynamicCharts(selectedObject: any): Promise<ProcessedSensor[]> {
  const processedSensors: ProcessedSensor[] = [];

  if (selectedObject?.Sensor) {
    for (const sensor of selectedObject.Sensor) {
      const sensorId = sensor.id
      const lastBaseValue = sensor.requestSensorInfo[0]?.last_base_value || 0;
      const baseZero = sensor.requestSensorInfo[0]?.base_zero || 0;
      const yValue = selectedObject.set_null ? lastBaseValue - baseZero : lastBaseValue;

      processedSensors.push({
        sensorId,
        yValue,
      });
    }
  }

  return processedSensors;
}
