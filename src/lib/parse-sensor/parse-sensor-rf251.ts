import hexStringToBuffer from "@/lib/parse-sensor/hex-string-to-buffer";

export default function parseSensorRf251(hexString: string | undefined, coefficient: number, limitValue: number) {
  // Проверка на неопределённость или пустоту hexString
  if (!hexString) {
    return {
      distance: "ошибка",
      temperature: "ошибка"
    };
  }

  const buffer = hexStringToBuffer(hexString);
  let distanceHex = '';

  // Проверка на длину буфера
  if (buffer.length !== 14) {
    return {
      distance: "ошибка",
      temperature: "ошибка"
    };
  }

  // Извлечение тетрад для расстояния
  for (let i = 7; i >= 0; i--) {
    distanceHex += (buffer[i] & 0x0f).toString(16);
  }

  // Преобразуем полученные тетрады в целое число
  let distanceValue = parseInt(distanceHex, 16);

  // Определяем знак и масштабируем значение
  if ((distanceValue & 0x80000000) !== 0) {
    distanceValue -= 0x100000000; // Если старший бит установлен, это отрицательное число
  }
  distanceValue *= 0.1; // Преобразуем в десятые доли микрона
  distanceValue = parseFloat(distanceValue.toFixed(2));

  // Извлечение тетрад для температуры (байты 8, 9, 10 и 11)
  let temperatureHex = '';
  for (let i = 11; i >= 8; i--) {
    temperatureHex += (buffer[i] & 0x0f).toString(16);
  }

  // Преобразуем полученные тетрады в целое число
  let temperatureValue = parseInt(temperatureHex, 16);

  // Определяем знак и масштабируем значение
  if ((temperatureValue & 0x8000) !== 0) {
    temperatureValue -= 0x10000; // Если старший бит установлен, это отрицательное число
  }
  temperatureValue *= 0.1; // Преобразуем в десятые доли градуса
  // Округляем значение температуры до двух знаков после запятой
  temperatureValue = parseFloat(temperatureValue.toFixed(2));
  if (Math.abs(Number(distanceValue)) >= limitValue) {
    return {
      distance: "ошибка",
      temperature: "ошибка"
    };
  }
    return {
      distance: distanceValue * coefficient,
      temperature: temperatureValue * coefficient
    };

}
