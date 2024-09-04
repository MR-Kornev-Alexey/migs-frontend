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
      {sensors.map((sensor, index) => {
        // Проверяем, все ли значения y равны нулю
        const allYAreZero = sensor.sensorData.every(dataPoint => dataPoint.y === 0);

        return (
          <div key={index} style={{ marginBottom: '20px' }}>
            <VictoryChart
              height={180}
              width={500}
              theme={VictoryTheme.material} // Добавляем тему для стилизации
              containerComponent={<VictoryVoronoiContainer />}
              domain={{ y: allYAreZero ? [0, 10] : undefined }} // Устанавливаем домен по оси Y от 0 до 10, если все y равны нулю
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
                  axis: { stroke: '#000' },
                  axisLabel: { fontSize: 7 },
                  ticks: { stroke: '#000', size: 5 },
                  tickLabels: { fontSize: 7, padding: 5, fill: '#333' }, // Увеличен шрифт и добавлен цвет для меток оси Y
                  grid: { stroke: '#e6e6e6' }, // Добавлена сетка для оси Y
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
                    angle: 270+45, // Поворот меток на 90 градусов
                    textAnchor: 'end' // Выравнивание текста по началу
                  },
                  grid: { stroke: '#e6e6e6' }, // Добавлена сетка для оси X
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
        );
      })}
    </div>
  );
};

export default AreaVictoryChart;
