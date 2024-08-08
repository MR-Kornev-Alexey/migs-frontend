export default function setKindOfObject(role: any) {
  switch (role) {
    case 'tower':
      return 'Башня';
    case 'bridge':
      return 'Мост';
    case 'building':
      return 'Здание';
    case 'footbridge':
      return 'Пешеходный мост';
    case 'overpass':
      return 'Путепровод';
    default:
      return '';
  }
}
