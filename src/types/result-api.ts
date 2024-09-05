import {type MObject} from "@/types/common-types";

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
  message?: any;
  groupedData?: any[];
  oneSensor?: any;
  allSensors?: any;
  organization?: any;
  selectedObjects?: any;
  allOrganizations?: Organization[];
  allObjects?:   any[] | undefined;
  selectedObject?: any;
}

export interface ApiResult {
  data?: Data;  // The result can have data of type Data
  error?: string;
  organization?: any;
  statusCode?: number;  // Note that statusCode is optional
  message?: string;
  allOrganizations?: any[];
  allObjects?: MObject[] | undefined ;
  allSensorsType?: any[];
  allSensors?:  any[];
  notifications?: any[];
  selectedObjects?: any[];
  groupedData?: any[];
  selectedObject?: any[];
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

