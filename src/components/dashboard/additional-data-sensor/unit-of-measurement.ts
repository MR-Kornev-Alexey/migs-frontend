interface MeasurementUnit {
  type: string;
  model: string;
  unitNames: string[];
  unitValues: string[];
  codes?: string[]; // Optional field since not all measurement units have codes
}

interface UnitOfMeasurement {
  strainGauge: MeasurementUnit[];
  inclinoMeter: MeasurementUnit[];
  rangefinder: MeasurementUnit[];
  GNSSReceiver: MeasurementUnit[];
  temperatureSensor: MeasurementUnit[];
  weatherStation: MeasurementUnit[];
}

// Optimized and structured UnitOfMeasurement object
const UnitOfMeasurement: any = {
  strainGauge: [
    {
      type: 'Тензометр',
      model: 'РФ-251',
      unitNames: ['мм (без коэф.)', 'мкм (без коэф.)', 'кгс/кв.см (с коэф.)'],
      unitValues: ['mm_without_coefficient', 'mkm_without_coefficient', 'kgf_sq_cm_with_coefficient'],
      codes: [],
    },
    {
      type: 'Тензометр',
      model: 'LS5',
      unitNames: ['мм', 'мкм', 'кгс/кв.см'],
      unitValues: ['mm', 'mkm', 'kgf_sq_cm'],
      codes: [], // Single value can still be an array for consistency
    },
    {
      type: 'Тензометр',
      model: 'SVWG-D01',
      unitNames: ['мм', 'мкм', 'кгс/кв.см'],
      unitValues: ['mm', 'mkm', 'kgf_sq_cm'],
      codes: ['45-86'],
    },
  ],
  inclinoMeter: [
    {
      type: 'Инклинометр',
      model: 'ИН-Д3',
      unitNames: ['угл.сек'],
      unitValues: ['angle_sec'],
      codes: [],
    },
  ],
  rangefinder: [
    {
      type: 'Дальномер',
      model: 'DLS-B 15',
      unitNames: ['мм'],
      unitValues: ['mm'],
    },
    {
      type: 'Дальномер',
      model: 'FLS-C 10',
      unitNames: ['мм'],
      unitValues: ['mm'],
    },
  ],
  GNSSReceiver: [
    {
      type: 'Приемник ГНСС',
      model: 'Galaxy G1 Plus',
      unitNames: ['мм', 'см'],
      unitValues: ['mm', 'sm'],
    },
  ],
  temperatureSensor: [
    {
      type: 'Датчик температуры',
      model: 'ДТС125М-50М',
      unitNames: ['градус (температура)'],
      unitValues: ['degree_temperature'],
    },
  ],
  weatherStation: [
    {
      type: 'Метеостанция',
      model: 'АУРА',
      unitNames: ['градус (температура), м/с, градус (угол)'],
      unitValues: ['meteo_value'],
    },
  ],
};

export default UnitOfMeasurement;
