export default function formatNetworkNumber(networkNumber: number): string {
  // Преобразуем сетевой номер в hex (два знака)
  let hexString = networkNumber.toString(16).toUpperCase().padStart(2, '0');

  // Преобразуем hex в ASCII
  let asciiString = '';
  for (let i = 0; i < hexString.length; i++) {
    asciiString += hexString.charCodeAt(i).toString(16).toUpperCase();
  }

  // Собираем окончательную строку
  return `23 ${asciiString[0]}${asciiString[1]} ${asciiString[2]}${asciiString[3]} 4C 52 0D`;
}


