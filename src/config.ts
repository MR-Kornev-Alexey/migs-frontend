import { getSiteURL } from '@/lib/get-site-url';
import { LogLevel } from '@/lib/logger';

export interface Config {
  site: { name: string; description: string; themeColor: string; url: string };
  logLevel: keyof typeof LogLevel;
}

// Retrieve BASE_URL and LOG_LEVEL from environment variables
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://80.78.245.91:8000';
// export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000';
// Define the configuration object
export const config: Config = {
  site: {
    name: 'ООО НИИ МИГС',
    description: '',
    themeColor: '#090a0b',
    url: getSiteURL(),
  },
  logLevel: (process.env.NEXT_PUBLIC_LOG_LEVEL as keyof typeof LogLevel) ?? LogLevel.ALL,
};
