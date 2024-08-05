import { type SensorInfo } from "@/types/sensor";

// Adjust the parameter type to be an array of SensorInfo
export default function sortSensorsByObjectId(sensors: SensorInfo[]) {
  return sensors.sort((a, b) => {
    if (a.object.id < b.object.id) {
      return -1;
    }
    if (a.object.id > b.object.id) {
      return 1;
    }
    return 0;
  });
}
