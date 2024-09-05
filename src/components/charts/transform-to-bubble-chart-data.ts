interface SensorInfo {
  last_base_value?: number;
  base_zero?: number;
}

interface Sensor {
  sensor_type: string;
  model: string;
  network_number: number;
  requestSensorInfo: SensorInfo[];
}

export default function createSeries(data: any) {
  // Group sensors by model
  const groupedByModel = data.Sensor.reduce((acc: Record<string, Sensor[]>, sensor: Sensor) => {
    if (!acc[sensor.model]) {
      acc[sensor.model] = [];
    }
    acc[sensor.model].push(sensor);
    return acc;
  }, {});

  const totalLength = 600; // Total length for x-axis
  const numberOfModels = Object.keys(groupedByModel).length;
  const spacing = totalLength / (numberOfModels + 1); // Calculate spacing for x-axis

  const series: any[] = [];
  let xOffset: number = spacing;

  // Iterate through each model group
  Object.keys(groupedByModel).forEach(model => {
    groupedByModel[model].forEach((sensor: Sensor) => { // Explicitly typing `sensor`
      sensor.requestSensorInfo.forEach(info => {
        const { last_base_value, base_zero } = info;
        const y = (last_base_value !== undefined && base_zero !== undefined)
          ? (data.set_null ? last_base_value - base_zero : last_base_value)
          : 0;

        series.push({
          name: `${sensor.sensor_type} - ${sensor.model} | ${sensor.network_number}`,
          data: [{
            x: xOffset, // Assign calculated x position
            y,
            z: 0 // Z value can be set based on additional logic if required
          }]
        });
      });
    });
    xOffset += spacing; // Increment xOffset for the next model
  });

  return series;
}
