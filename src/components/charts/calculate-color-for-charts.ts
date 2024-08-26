export default async function calculateColorForCharts(
  max_base: number,
  last_base_value: number,
  min_base: number,
  limitValue: number
): Promise<string> {

  if (last_base_value&&limitValue) {
    if (last_base_value >= limitValue || last_base_value <= -limitValue) {
      return '#4b4a4a'; // Серый (default)
    }
  }

  if( last_base_value > max_base || last_base_value < min_base) {
    return  '#c00213';
  }

  if(last_base_value > min_base*1.2 && last_base_value < max_base*0.8) {
    return  '#023816';
  }
    return  '#fcc205';


}
