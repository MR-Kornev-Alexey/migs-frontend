import React from 'react';
import {
  VictoryChart,
  VictoryGroup,
  VictoryArea,
  VictoryScatter,
  VictoryTooltip,
  VictoryVoronoiContainer,
  VictoryAxis,
  VictoryTheme,
  VictoryLabel
} from 'victory';

// Типы данных для компонента
type SensorData = {
  x: string; // Дата в виде строки
  y: number;
};

type ProcessedSensor = {
  sensorName: string;
  sensorLocation: string;
  sensorColor: string;
  sensorData: SensorData[];
};

type AreaVictoryChartProps = {
  sensors: ProcessedSensor[] | null; // Данные могут быть null, если они еще не загружены
};

const AreaVictoryChart: React.FC<AreaVictoryChartProps> = ({ sensors }) => {
  // Проверяем, загрузились ли данные
  if (!sensors || sensors.length === 0) {
    return <div>Loading data...</div>; // Показываем сообщение о загрузке, пока данные не загрузятся
  }

  return (
    <div>
      {sensors.map((sensor, index) => (
        <div key={index} style={{ marginBottom: '20px' }}>
          <VictoryChart
            height={180}
            width={500}
            theme={VictoryTheme.material} // Добавляем тему для стилизации
            containerComponent={<VictoryVoronoiContainer />}
          >
            {/* Добавляем название внутрь графика */}
            <VictoryLabel
              text={`${sensor.sensorName} ${sensor.sensorLocation}`}
              x={250}  // Позиция по оси X (центр графика)
              y={20}   // Позиция по оси Y (внутри сверху)
              textAnchor="middle" // Центрируем текст
              style={{ fontSize: 10 }} // Стилизация текста
            />

            {/* Настройка оси Y */}
            <VictoryAxis
              dependentAxis
              tickFormat={(t) => `${t} мкм`} // Форматирование меток на оси Y
              style={{
                axis: { stroke: '#756f6a' },
                grid: { stroke: '#e6e6e6' }, // Добавляем сетку по оси Y
                ticks: { stroke: 'grey', size: 5 },
                tickLabels: { fontSize: 8, padding: 5 }, // Установка шрифта на 8 для оси Y
              }}
            />

            {/* Настройка оси X */}
            <VictoryAxis
              tickFormat={(t) => t} // Отображаем строки (даты) как метки на оси X
              style={{
                tickLabels: {
                  fontSize: 7, // Устанавливаем шрифт на 7 для оси X
                  padding: 5,
                  angle: 45, // Поворачиваем метки на 45 градусов
                  textAnchor: 'start', // Точка привязки текста после поворота
                },
                grid: { stroke: '#e6e6e6' }, // Добавляем сетку по оси X, если требуется
              }}
            />

            <VictoryGroup
              color={sensor.sensorColor}
              labels={({ datum }) =>
                `${sensor.sensorName} ${sensor.sensorLocation}\n${datum.y} мкм`
              }
              labelComponent={<VictoryTooltip style={{ fontSize: 8 }} />}
              data={sensor.sensorData}
            >
              <VictoryArea
                style={{
                  data: { fill: sensor.sensorColor, opacity: 0.3 }, // Устанавливаем цвет и прозрачность области
                }}
              />
              <VictoryScatter
                size={({ active }) => (active ? 5 : 3)}
                labels={({ datum }) =>
                  `${sensor.sensorName} ${sensor.sensorLocation}\n${datum.y} мкм`
                }
                labelComponent={
                  <VictoryTooltip
                    style={{ fontSize: 8 }}
                    flyoutStyle={{ fill: 'white' }}
                  />
                }
              />
            </VictoryGroup>
          </VictoryChart>
        </div>
      ))}
    </div>
  );
};

export default AreaVictoryChart;
