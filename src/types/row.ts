export interface Row {
  id: string;
  object: {
    id: string;
    name: string;
    address: string;
  };
  ip_address: string;
  run: boolean;
  sensor_type: string;
  model: string;
  designation: string;
  network_number: string;
}
