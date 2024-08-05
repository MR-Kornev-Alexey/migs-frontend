export interface Organization {
  id: string;
  name: string;
  inn: string;
  address: string;
  directorName: string;
  organizationPhone: string;
  organizationEmail: string;
}

export interface AdditionalUserInfo {
  firstName: string;
  surName: string;
  telegram: string;
  phone: string;
  position: string;
}

export interface CustomerType {
  id: string;
  name: string;
  email: string;
  telegramId?: number;
  telegramInfo?: boolean;
  password: string;
  role: string;
  organization?: Organization; // Use a single object, not an array
  registration_status: string;
  created_at: Date;
  additionalUserInfo?: AdditionalUserInfo[];
}
