export interface SendData {
  inn: string;
  email: string;
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
  allOrganizations?: Organization[]
}

export interface ApiResult {
  data?: Data;  // The result can have data of type Data
  error?: string;
  organization?: any;
  statusCode?: number;  // Note that statusCode is optional
  message?: string;
  allOrganizations?: any
}

export interface Organization {
  id: string;
  name: string;
  inn: string;
  address: string;
  directorName: string;
  organizationPhone: string;
  organizationEmail: string;
}

