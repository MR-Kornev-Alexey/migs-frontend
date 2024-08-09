export default async function updateSensorsAfterAPI(currentSensors:any, updateSensor:any) {
  return currentSensors.map((sensor:any) => {
    if (sensor.id === updateSensor.id) {
      return { ...sensor, ...updateSensor };
    }
    return sensor;
  });
}
