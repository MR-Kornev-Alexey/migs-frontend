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
      }
    ],
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter (y: number | undefined): string {
          if (typeof y !== "undefined") {
            return `${y.toFixed(0)  } мкм`;
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
