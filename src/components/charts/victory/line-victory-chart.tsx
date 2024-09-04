import React from 'react';
import {
  VictoryChart,
  VictoryGroup,
  VictoryLine,
  VictoryScatter,
  VictoryTooltip,
  VictoryVoronoiContainer,
  VictoryAxis,
  VictoryLabel,
} from 'victory';

type SensorData = {
  x: number;
  y: number;
};

type ProcessedSensor = {
  sensorName: string;
  sensorLocation: string;
  sensorColor: string;
  sensorData: SensorData[];
};

type LineVictoryChartProps = {
  sensors: ProcessedSensor[];
};

const LineVictoryChart: React.FC<LineVictoryChartProps> = ({ sensors }) => {
  return (
    <VictoryChart height={250} width={500} containerComponent={<VictoryVoronoiContainer/>}>
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
        tickFormat={(t) => Number.isInteger(t) ? t : null} // Показываем только целые числа
        style={{
          tickLabels: { fontSize: 8, padding: 5 }, // Установка шрифта на 8 для оси X
          grid: { stroke: '#e6e6e6' } // Добавляем сетку по оси X, если требуется
        }}
      />

      {sensors.map((sensor, index) => (
        <VictoryGroup
          key={index}
          color={sensor.sensorColor}
          labels={({ datum }) => `${sensor.sensorName} ${sensor.sensorLocation}\n ${datum.y} мкм`}
          labelComponent={<VictoryTooltip style={{ fontSize: 8 }} />}
          data={sensor.sensorData}
        >
          <VictoryLine />
          <VictoryScatter
            size={({ active }) => (active ? 5 : 3)}
            labels={({ datum }) => `${sensor.sensorName} ${sensor.sensorLocation}\n${datum.y} мкм`}
            labelComponent={<VictoryTooltip
              style={{ fontSize: 8 }}
              flyoutStyle={{ fill: "white" }}
            />}
          />
        </VictoryGroup>
      ))}
    </VictoryChart>
  );
};

export default LineVictoryChart;
