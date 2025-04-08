import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, ChartData, ChartOptions, ChartType } from 'chart.js/auto';

interface ChartRendererProps {
  type: ChartType;
  data: ChartData | undefined;
  options?: ChartOptions;
}

const ChartRenderer: React.FC<ChartRendererProps> = ({ type, data, options = {} }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create new chart with default data if no data is provided
    const defaultData: ChartData = {
      labels: ['No Data'],
      datasets: [{
        data: [1],
        backgroundColor: ['#e0e0e0']
      }]
    };

    const chartData = data || defaultData;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const defaultOptions: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: type === 'pie' || type === 'doughnut',
          position: 'bottom' as const
        }
      }
    };

    chartInstance.current = new ChartJS(ctx, {
      type,
      data: chartData,
      options: {
        ...defaultOptions,
        ...options
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [type, data, options]);

  return (
    <div style={{ position: 'relative', height: '300px' }}>
      <canvas ref={chartRef} />
    </div>
  );
};

export default ChartRenderer; 