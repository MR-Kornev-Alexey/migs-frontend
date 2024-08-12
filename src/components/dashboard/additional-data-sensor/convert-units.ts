export default function convertUnits(unit: any) {
  switch (unit) {
    case 'mm_without_coefficient':
      return 'мм (без коэф.)';
    case 'mkm_without_coefficient':
      return 'мкм (без коэф.)';
    case 'kgf_sq_cm_with_coefficient':
      return 'кгс/кв.см (с коэф.)';
    case 'mm':
      return 'мм';
    case 'sm':
      return 'см';
    case 'mkm':
      return 'мкм';
    case 'angle_sec':
      return 'угл.сек';
    case 'degree_temperature':
      return 'градус (температура)';
    case 'meteo_value':
      return 'градус(температура), м/с, градус (угол)';
    default:
      return '';
  }
}
