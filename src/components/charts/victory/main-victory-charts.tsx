import React from 'react';
import {VictoryChart, VictoryBar, VictoryAxis, VictoryZoomContainer, VictoryTheme, VictoryContainer} from 'victory';
import {VictoryChartData} from "@/types/victory-chart-data";

interface Props {
  data: VictoryChartData[];
}
const MyBarChart = ({data}: Props) => (
  <VictoryChart
    containerComponent={<VictoryContainer />}
    theme={VictoryTheme.material}
    width={500}
    height={200}
    domainPadding={{ x: 20 }}
    padding={{ top: 20, bottom: 90, left: 30, right: 30 }}
  >
    <VictoryBar
      data={data}
      labels={({ datum }) => datum.y}
      style={{
        data: {
          fill: ({ datum }) => datum.color,
        },
        labels: {
          fontSize: 8,
          fill: '#000'
        }
      }}
      barWidth={20} // Установка фиксированной ширины столбцов
    />
    <VictoryAxis
      tickFormat={(x) => `${x}`}
      style={{
        axis: { stroke: '#000' },
        axisLabel: { fontSize: 8 },
        ticks: { stroke: '#000', size: 5 },
        tickLabels: {
          fontSize: 6,
          fill: '#000',
          angle: 270+45, // Поворот меток на 90 градусов
          textAnchor: 'end' // Выравнивание текста по началу
        }
      }}
    />
    <VictoryAxis
      dependentAxis
      tickFormat={(y) => `${y}`}
      style={{
        axis: { stroke: '#000' },
        axisLabel: { fontSize: 8 },
        ticks: { stroke: '#000', size: 5 },
        tickLabels: { fontSize: 8, fill: '#000' }
      }}
    />
  </VictoryChart>
);

export default MyBarChart;
