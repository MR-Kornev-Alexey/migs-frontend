export default function hexToAsciiAndConvert(sequence: string, coefficient: number, limitValue: number): number | string {
  try {
    // 1. Извлекаем интересующую нас часть строки: с 10 по 19 символы.
    const hexSegment = sequence.slice(10, 20);

    // Проверка, что извлеченный сегмент имеет правильную длину
    if (hexSegment.length !== 10) {
      return 'ошибка';
    }

    // 2. Преобразуем HEX в ASCII.
    let asciiStr = '';
    for (let i = 0; i < hexSegment.length; i += 2) {
      const hexPair = hexSegment.slice(i, i + 2);
      const asciiChar = String.fromCharCode(parseInt(hexPair, 16));

      // Проверка на допустимые символы в ASCII
      if (isNaN(asciiChar.charCodeAt(0))) {
        return 'ошибка';
      }

      asciiStr += asciiChar;
    }

    // 3. Преобразуем полученную строку в целое и дробное число.
    const integerPart = parseInt(asciiStr.slice(0, 4), 10); // Первые четыре символа - целое число
    const fractionalPart = parseInt(asciiStr.slice(4), 10); // Последний символ - десятичная дробь

    // Проверка на валидность целого и дробного числа
    if (isNaN(integerPart) || isNaN(fractionalPart)) {
      return 'ошибка';
    }
    const distanceValue: number = (integerPart + fractionalPart / 10) * coefficient;
    if (Math.abs(distanceValue) >= limitValue) {
      return 'ошибка';
    } else {
      return distanceValue
    }
  } catch (error) {
    return 'ошибка';
  }
}
