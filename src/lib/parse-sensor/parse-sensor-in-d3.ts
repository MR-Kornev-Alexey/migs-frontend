import hexStringToBuffer from "@/lib/parse-sensor/hex-string-to-buffer";


export default function parseSensorInD3(hexDataString: string, coefficient: number, limitValue: number) {
  const buffer = hexStringToBuffer(hexDataString);

  // Проверяем, что размер буфера соответствует ожидаемому размеру ответа
  if (buffer.length !== 12) {
    return {
      angleY: "ошибка",
      angleX: "ошибка",
      magnitude: "ошибка",
    };
  }

  const actualChecksum = buffer[10];

  // Расчет контрольной суммы
  let calculatedChecksum = 0;
  for (let i = 1; i < 10; i++) {
    calculatedChecksum ^= buffer[i];
  }

  // Сравниваем контрольные суммы
  if (calculatedChecksum !== actualChecksum) {
    return {
      angleY: "ошибка",
      angleX: "ошибка",
      magnitude: "ошибка",
    };
  }

  // Разбор буфера на составляющие поля данных
  // Извлекаем значения байтов из буфера
  const D0 = buffer[4];
  const D1 = buffer[5];
  const D2 = buffer[6];
  const D3 = buffer[7];
  const D4 = buffer[8];
  const D5 = buffer[9];

  // Преобразование шестнадцатеричных значений в числовые
  const angleYFractional = D0 / 256;
  const angleYInteger = ((D2 & 0x3f) << 8) + D1;
  const angleYSign = (D2 >> 7) & 0x01;
  let angleY = (angleYInteger + angleYFractional) * (angleYSign === 0 ? 1 : -1);
  angleY = angleY * coefficient;
  angleY = parseFloat(angleY.toFixed(2));

  const angleXFractional = D3 / 256;
  const angleXInteger = ((D5 & 0x3f) << 8) + D4;
  const angleXSign = (D5 >> 7) & 0x01;
  let angleX = (angleXInteger + angleXFractional) * (angleXSign === 0 ? 1 : -1);
  angleX = angleX * coefficient;
  angleX = parseFloat(angleX.toFixed(2));

  // Расчет модуля значения
  const magnitude = Math.sqrt(angleY * angleY + angleX * angleX).toFixed(2);
  if (Math.abs(Number(magnitude)) >= limitValue) {
    return {
      angleY: "ошибка",
      angleX: "ошибка",
      magnitude: "ошибка",
    };
  } 
    return {
      angleY,
      angleX,
      magnitude: parseFloat(magnitude),
    };
  
}
