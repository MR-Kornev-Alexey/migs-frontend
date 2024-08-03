// Define the interface for the custom additional data
export interface CustomAdditionalData {
  email: string;
  password: string;
  user_id: string; // UUID for user identification
  firstName: string; // User's first name
  surName: string; // User's surname
  phone: string; // User's phone number
  telegram?: string; // Optional Telegram handle
  position: string; // User's job position
  created_at: string; // Date and time of creation in ISO format
  updated_at?: string | null; // Date and time of last update in ISO format, or null if not updated
}
