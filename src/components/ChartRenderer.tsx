import React, { useRef, useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Plugin, PointElement } from 'chart.js';
import { Doughnut, Bar, Bubble } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement);

// Function to generate professional colors
export const getProfessionalColors = (count: number): string[] => {
  const colors = [
    '#4e79a7', // Blue
    '#f28e2c', // Orange
    '#e15759', // Red
    '#76b7b2', // Teal
    '#59a14f', // Green
    '#edc949', // Yellow
    '#af7aa1', // Purple
    '#ff9da7', // Pink
    '#9c755f', // Brown
    '#bab0ab'  // Gray
  ];
  return colors.slice(0, count);
};

// Create a custom plugin to set willReadFrequently on canvas
const willReadFrequentlyPlugin: Plugin = {
  id: 'willReadFrequently',
  beforeInit: (chart: any) => {
    const canvas = chart.canvas;
    if (canvas) {
      canvas.setAttribute('willReadFrequently', 'true');
    }
  }
};

interface ChartRendererProps {
  type: 'pie' | 'bar' | 'horizontalBar' | 'bubble';
  data: any;
  width?: number;
  height?: number;
  options?: any;
}

const ChartRenderer: React.FC<ChartRendererProps> = ({ type, data, width = 400, height = 300, options = {} }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Set up intersection observer for scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (chartRef.current) {
      observer.observe(chartRef.current);
    }

    return () => {
      if (chartRef.current) {
        observer.unobserve(chartRef.current);
      }
    };
  }, []);

  // Set willReadFrequently attribute on canvas elements
  useEffect(() => {
    if (chartRef.current) {
      const canvasElements = chartRef.current.querySelectorAll('canvas');
      canvasElements.forEach(canvas => {
        canvas.setAttribute('willReadFrequently', 'true');
      });
    }
  }, [data]);

  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: true,
    indexAxis: type === 'horizontalBar' ? 'y' : 'x',
    animation: {
      duration: 1500,
      easing: 'easeOutQuart',
      delay: (context: any) => {
        if (context.type === 'data' && context.mode === 'default') {
          return context.dataIndex * 100;
        }
        return 0;
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            return `${context.label}: ${value}%`;
          }
        }
      }
    },
    scales: {
      x: {
        stacked: type === 'bar',
        display: type !== 'pie',
        title: {
          display: false
        },
        ticks: {
          callback: (value: any) => type === 'horizontalBar' ? value : `${value}%`
        }
      },
      y: {
        stacked: type === 'bar',
        display: type !== 'pie',
        title: {
          display: false
        }
      }
    }
  };

  // Merge default options with provided options
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    plugins: {
      ...defaultOptions.plugins,
      ...(options.plugins || {})
    }
  };

  const chartData = {
    ...data,
    datasets: data.datasets.map((dataset: any, index: number) => ({
      ...dataset,
      backgroundColor: type === 'pie' 
        ? getProfessionalColors(data.labels.length)
        : type === 'bar' || type === 'horizontalBar'
          ? data.labels.length === 1 // Presenting Issues has only one label
            ? getProfessionalColors(data.datasets.length)[index]
            : getProfessionalColors(data.labels.length)
          : getProfessionalColors(data.datasets.length)[index],
      borderColor: type === 'pie' 
        ? getProfessionalColors(data.labels.length).map(color => `${color}80`)
        : type === 'bar' || type === 'horizontalBar'
          ? data.labels.length === 1 // Presenting Issues has only one label
            ? getProfessionalColors(data.datasets.length)[index]
            : getProfessionalColors(data.labels.length).map(color => `${color}80`)
          : getProfessionalColors(data.datasets.length)[index],
      borderWidth: 1
    }))
  };

  // Create doughnut label plugin
  const doughnutLabelPlugin = {
    id: 'doughnutLabel',
    beforeDraw: (chart: any) => {
      if (type !== 'pie') return;
      
      const { ctx } = chart;
      const { width, height } = chart;
      ctx.restore();
      const fontSize = (height / 114).toFixed(2);
      ctx.font = `${fontSize}em sans-serif`;
      ctx.textBaseline = 'middle';
      const text = chart.data.datasets[0].totalCount?.toString() || '0';
      const textX = Math.round((width - ctx.measureText(text).width) / 2);
      const textY = height / 2;
      ctx.fillText(text, textX, textY);
      ctx.save();
    }
  };

  // Combine all plugins
  const allPlugins = [doughnutLabelPlugin];

  // Only render the chart when it's visible
  return (
    <div ref={chartRef} className="chart-wrapper">
      {isVisible && (
        <>
          {type === 'pie' ? (
            <Doughnut 
              data={chartData} 
              options={mergedOptions}
              plugins={allPlugins}
            />
          ) : type === 'bubble' ? (
            <Bubble 
              data={chartData} 
              options={mergedOptions}
              plugins={[]}
            />
          ) : (
            <Bar 
              data={chartData} 
              options={mergedOptions}
              plugins={[]}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ChartRenderer; 