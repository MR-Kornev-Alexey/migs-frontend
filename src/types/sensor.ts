export interface ObjectInfo {
  id: string;
  organization_id: string;
  objectsType: string;
  objectsMaterial: string;
  geo: string;
  name: string;
  address: string;
  notation: string;
  set_null?: boolean; // Assuming this might be optional
  periodicity?: number; // Assuming this might be optional
}

export interface SensorAndObjectInfoApi {
  data: Data;
  message: number;
  statusCode: number;
  error: string;
}

interface Data {
  allSensors: SensorInfo[];
  allObjectsFromApi: ObjectInfo[];
  allSensorsType: SensorModel[];
  message: number;
  statusCode: number;
}

interface SensorModel {
  id: string;
  sensor_key: string;
  sensor_type: string;
  models: string[];
}

export interface SensorInfo {
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
  name: string;
  object: ObjectInfo;
  additional_sensor_info: AdditionalSensorInfo[];
  sensor_operation_log: SensorOperationLog[];
  files: string[]; // More specific typing can be added if known
  requestSensorInfo: LatestData[];
  error_information: string[];
  [key: string]: any; // Allows dynamic key access// More specific typing can be added if known
}

export interface AdditionalSensorInfo {
  id: number;
  sensor_id: string;
  factory_number: string | null;
  unit_of_measurement: string | null;
  installation_location: string | null;
  coefficient: number;
  limitValue: number;
  emissionsQuantity: number;
  errorsQuantity: number;
  missedConsecutive: number;
  maxQuantity: number;
  minQuantity: number;
  additionalSensorInfoNotation: string | null;
}

interface SensorOperationLog {
  id: number;
  sensor_id: string;
  passport_information: string;
  verification_information: string;
  warranty_information: string;
  sensorOperationLogNotation: string;
}

export interface LatestData {
  id: number;
  sensor_id: string;
  periodicity: number;
  request_code: string;
  counter: number;
  alarm_counter: number;
  last_base_value: number;
  last_valueX: number;
  last_valueY: number;
  last_valueZ: number;
  base_zero: number;
  min_base: number;
  max_base: number;
  warning: boolean;
}
