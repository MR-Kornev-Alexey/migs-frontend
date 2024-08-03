export interface Organization {
  id: string;
  name: string;
  inn: string;
  address: string;
  directorName: string;
  organizationPhone: string;
  organizationEmail: string;
}

export interface SendData {
  inn: string;
  email: string;
}

// types.ts or similar file
export interface Data {
  groupedData?: any;
  oneSensor?: any;
  allSensors?: any;
  organization?: any;
}



export interface Result {
  data?: Data;
  error?: string;
  statusCode?: number;  // Note that statusCode is optional
  message?: string;
  organization?: any;
}


export interface Data {
  statusCode?: number;  // Make sure these fields match your API response
  message?: string;
  groupedData?: any;
  oneSensor?: any;
  allSensors?: any;
  organization?: any;
}

export interface ApiResult {
  data?: Data;  // The result can have data of type Data
  error?: string;
  organization?: any;
  statusCode?: number;  // Note that statusCode is optional
  message?: string;
}


