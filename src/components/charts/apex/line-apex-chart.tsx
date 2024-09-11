import React from 'react';
import ApexCharts from 'react-apexcharts';

function LineApexChart({ series, labels }: { series: any; labels: any; }) {
  const options: any = {
    series: [{
      name: '',
      type: 'area',
      data: series
    }],
    chart: {
      height: 350,
      type: 'line',
    },
    stroke: {
      curve: 'smooth'
    },
    fill: {
      type: 'solid',
      opacity: [0.15],
    },
    labels,
    markers: {
      size: 2
    },
    yaxis: [
      {
        title: {
          text: 'Микрометры',
        },
        labels: {
          formatter: function (value: number) {
            return value.toFixed(2); // Округление до 2 знаков после запятой
          }
        }
      }
    ],
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter(y: number | undefined): string {
          if (typeof y !== "undefined") {
            return `${y.toFixed(2)} мкм`; // Округление в подсказках до 2 знаков
          }
          return '';
        }
      }
    }
  };

  return (
    <div>
      <ApexCharts
        options={options}
        series={options.series}
        type="line"
        height={300}
      />
    </div>
  );
}

export default LineApexChart;
