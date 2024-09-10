export default function transliterateAndReplaceSpaces(input: string): string {
  const cyrillicToLatinMap: Record<string, string> = {
    'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'E',
    'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
    'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
    'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Shch',
    'Ы': 'Y', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya', 'Ъ': '', 'Ь': '',

    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
    'ы': 'y', 'э': 'e', 'ю': 'yu', 'я': 'ya', 'ъ': '', 'ь': '',
  };

  return input
    .split('')  // Разбиваем строку на символы
    .map(char => {
      if (cyrillicToLatinMap[char]) {
        return cyrillicToLatinMap[char];  // Замена кириллических символов на латиницу
      } else if (/[a-zA-Z0-9]/.test(char)) {
        return char;  // Оставляем латиницу и цифры
      } else if (char === '.') {
        return '.';  // Оставляем точку без изменений
      } else if (/\s/.test(char)) {
        return '_';  // Заменяем пробелы на подчеркивания
      } else {
        return '_';  // Все остальные символы заменяем на подчеркивания
      }
    })
    .join('');  // Собираем строку обратно
}

// Пример использования
const input = "Пример строки с точкой. 123!";
const result = transliterateAndReplaceSpaces(input);
console.log(result); // "Primer_stroki_s_tochkoy._123_"
