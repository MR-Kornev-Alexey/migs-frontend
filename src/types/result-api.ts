import { type SensorInfo } from '@/types/sensor';

interface Record {
  id: number;
  sensor_id: string;
  request_code: string;
  answer_code: string;
  created_at: string;
}
type GroupedData = Record<string, Record[]>;

interface Data {
  groupedData: GroupedData;
  oneSensor: SensorInfo;
  allSensors: SensorInfo[];
  message: number;
  statusCode: number;
  organization: string[];
}

export interface Result {
  data?: {
    allSensors?: SensorInfo[];
    oneSensor?: SensorInfo;
  };
  message?: string;
  statusCode?: number;
  error?: any;
}
