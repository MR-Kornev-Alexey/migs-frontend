import decimalToHex from '@/lib/calculate/decimal-to-hex';
import formatSensorString from '@/lib/calculate/inclinometer-format-sensor-string';

// Define the possible models as a TypeScript union type
type SensorModel = 'ИН-Д3' | 'РФ-251';

export default async function calculateRequestCode(netNumber: number | string, model: string): Promise<string> {
  // Convert netNumber to a number if it's a string
  const netNumberValue = typeof netNumber === 'string' ? Number(netNumber) : netNumber;

  // Convert the number to hexadecimal
  const hexNumber = decimalToHex(netNumberValue);

  switch (model) {
    case 'ИН-Д3':
      return formatSensorString(netNumberValue);
    case 'РФ-251':
      return hexNumber + ' ' + 86;
    default:
      return 'error';
  }
}
