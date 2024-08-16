export default function calculateColorForCharts(
  max_base: number | undefined,
  last_base_value: number | undefined,
  min_base: number | undefined,
  limitValue: number | undefined
): string {
  if (max_base === 0) {
    return '#023816'; // Зеленый
  }

  if (last_base_value&&limitValue) {
    if (last_base_value >= limitValue || last_base_value <= -limitValue) {
      return '#4b4a4a'; // Серый (default)
    }
  } else {
    return '#4b4a4a'; // Серый (default)
  }


  let color = '';

  if (max_base && min_base) {
    if (min_base === 0) {
      if (last_base_value > max_base * 0.3 && last_base_value < max_base * 0.7) {
        color = '#023816'; // Зеленый
      } else if (
        (last_base_value <= max_base * 0.3 && last_base_value >= 0) ||
        (last_base_value >= max_base * 0.7 && last_base_value < max_base)
      ) {
        color = '#fcc205'; // Желтый
      } else if (last_base_value < 0 || last_base_value >= max_base) {
        color = '#c00213'; // Красный
      } else {
        color = '#4b4a4a'; // Серый (default)
      }
    } else {
      if (last_base_value > min_base * 1.3 && last_base_value < max_base * 0.7) {
        color = '#023816'; // Зеленый
      } else if (
        (last_base_value >= min_base && last_base_value <= min_base * 1.3) ||
        (last_base_value >= max_base * 0.7 && last_base_value < max_base)
      ) {
        color = '#fcc205'; // Желтый
      } else if (last_base_value < min_base || last_base_value >= max_base) {
        color = '#c00213'; // Красный
      } else {
        color = '#4b4a4a'; // Серый (default)
      }
    }
  } else {
    return '#4b4a4a'; // Серый (default)
  }


  return color;
}
