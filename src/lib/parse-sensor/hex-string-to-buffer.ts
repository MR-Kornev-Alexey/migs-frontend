export default function hexStringToBuffer(hexString: string): Uint8Array {
  // Проверка на четность длины строки
  if (hexString.length % 2 !== 0) {
    throw new Error('Invalid hex string');
  }

  // Создание буфера нужного размера
  const buffer = new Uint8Array(hexString.length / 2);

  // Заполнение буфера байтами из шестнадцатеричной строки
  for (let i = 0; i < hexString.length; i += 2) {
    buffer[i / 2] = parseInt(hexString.substring(i, i + 2), 16);
  }

  return buffer;
}
