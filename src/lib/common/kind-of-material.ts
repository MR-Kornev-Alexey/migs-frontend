export default function setKindOfMaterial(type: string) {
  switch (type) {
    case 'steel':
      return 'Стальная конструкция';
    case 'ferroconcrete':
      return 'Железобетонная конструкция';
    case 'wood':
      return 'Деревянная конструкция';
    case 'mixed':
      return 'Комбинированная конструкция';
    default:
      return 'Не определен';
  }
}
