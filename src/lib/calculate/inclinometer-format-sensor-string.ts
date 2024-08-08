// Converts a decimal number to its hexadecimal representation
function decimalToHex(decimal: number): string {
  if (decimal < 0) {
    return '-' + Math.abs(decimal).toString(16).padStart(2, '0');
  }
  return decimal.toString(16).padStart(2, '0');
}

// Calculates checksum for protocol ID, packet ID, and address
function calculateChecksum(protocolId: number, packetId: number, address: number): string {
  const sum = protocolId ^ packetId ^ address;
  return decimalToHex(sum);
}

// Formats the sensor string
export default function formatSensorString(address: number): string {
  const protocolId = 0x9b; // Fixed value
  const packetId = 0x01;   // Fixed value

  const hexAddress = decimalToHex(address);
  const checksum = calculateChecksum(protocolId, packetId, address);

  return `7e ${decimalToHex(protocolId)} ${decimalToHex(packetId)} ${hexAddress} ${checksum} 7e`;
}
