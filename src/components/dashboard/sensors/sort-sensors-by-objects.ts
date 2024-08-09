import { type SensorInfo } from "@/types/sensor";

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
