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
  VictoryLabel,
  VictoryLine
} from 'victory';
import { SvgSpinnersEclipseHalf } from "@/components/animated-icon/eclipse-half";

// Типы данных для компонента
interface SensorData {
  x: string; // Дата в виде строки
  y: number;
}

interface ProcessedSensor {
  sensorName: string;
  sensorLocation: string;
  sensorColor: string;
  sensorMin: number;
  sensorMax: number;
  sensorZero: number;
  sensorData: SensorData[];
}

interface AreaVictoryChartProps {
  sensors: ProcessedSensor[] | null; // Данные могут быть null, если они еще не загружены
}

const AreaVictoryChart: React.FC<AreaVictoryChartProps> = ({ sensors }) => {
  // Проверяем, загрузились ли данные
  if (!sensors || sensors.length === 0) {
    return <SvgSpinnersEclipseHalf />; // Показываем индикатор загрузки
  }

  return (
    <div>
      {sensors.map((sensor, index) => {
        // Проверяем, все ли значения y равны нулю
        const allYAreZero = sensor.sensorData.every(dataPoint => dataPoint.y === 0);

        // Определяем минимальное и максимальное значение по оси Y
        const minY = sensor.sensorMin;
        const maxY = sensor.sensorMax;
        const zero = sensor.sensorZero;
        // Получаем полный диапазон значений по оси X
        const xValues = sensor.sensorData.map((d) => d.x);

        return (
          <div key={index} style={{ marginBottom: '20px' }}>
            <VictoryChart
              height={180}
              width={500}
              theme={VictoryTheme.material}
              containerComponent={<VictoryVoronoiContainer />}
              domain={{ y: allYAreZero ? [0, 10] : undefined }} // Домен по оси Y, если все y равны 0
            >
              {/* Добавляем название внутрь графика */}
              <VictoryLabel
                text={`${sensor.sensorName} ${sensor.sensorLocation}\n логический ноль: ${zero}`}
                x={250} // Центр по оси X
                y={20}  // Внутри сверху
                textAnchor="middle"
                style={{ fontSize: 7 }}
              />

              {/* Настройка оси Y */}
              <VictoryAxis
                dependentAxis
                tickFormat={(t) => `${t} мкм`}
                style={{
                  axis: { stroke: '#000' },
                  ticks: { stroke: '#000', size: 5 },
                  tickLabels: { fontSize: 7, padding: 5, fill: '#333' },
                  grid: { stroke: '#e6e6e6' },
                }}
              />

              {/* Настройка оси X */}
              <VictoryAxis
                tickFormat={(x) => `${x}`}
                style={{
                  axis: { stroke: '#000' },
                  ticks: { stroke: '#000', size: 5 },
                  tickLabels: {
                    fontSize: 5,
                    fill: '#000',
                    angle: 315, // Поворот меток на 45 градусов
                    textAnchor: 'end',
                  },
                  grid: { stroke: '#e6e6e6' },
                }}
              />

              {/* Горизонтальная линия для минимального значения */}
              {zero === 0 &&
                <VictoryLine
                style={{
                data: { stroke: "red", strokeWidth: 1, strokeDasharray: "5,5" }
              }}
                data={xValues.map((x) => ({ x, y: minY }))}
                labels={({ datum }) => `минимум: ${datum.y} мкм`}
                labelComponent={<VictoryTooltip style={{ fontSize: 8 }} />}
                />
              }

              {/* Горизонтальная линия для максимального значения */}
              {zero === 0 &&
              <VictoryLine
                style={{
                  data: { stroke: "blue", strokeWidth: 2, strokeDasharray: "5,5" }
                }}
                data={xValues.map((x) => ({ x, y: maxY }))}
                labels={({ datum }) => `максимум: ${datum.y} мкм`}
                labelComponent={<VictoryTooltip style={{ fontSize: 8 }} />}
              />}

              <VictoryGroup
                color={sensor.sensorColor}
                labels={({ datum }) =>
                  `${datum.y.toFixed(2)} мкм`
                }
                labelComponent={<VictoryTooltip style={{ fontSize: 8 }} />}
                data={sensor.sensorData}
              >
                <VictoryArea
                  style={{
                    data: { fill: sensor.sensorColor, opacity: 0.3 },
                  }}
                />
                <VictoryScatter
                  size={({ active }) => (active ? 4 : 2)}
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
        );
      })}
    </div>
  );
};

export default AreaVictoryChart;
