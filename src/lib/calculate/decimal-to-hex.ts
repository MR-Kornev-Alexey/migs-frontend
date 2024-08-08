export default function decimalToHex(decimal: number): string {
  return decimal.toString(16).padStart(2, '0');
}
