import React from 'react';
import ChartRenderer from './ChartRenderer';
import { ChartType } from 'chart.js';

export interface ChartSectionConfig {
  name: string;
  title: string;
  chartType: ChartType;
  dataKey: string;
  countLabel: string;
  percentageLabel: string;
  options?: any;
}

interface ChartSectionProps {
  config: ChartSectionConfig;
  data: any;
  isVisible: boolean;
  onVisibilityChange: () => void;
}

export const CHART_SECTIONS: ChartSectionConfig[] = [
  {
    name: 'gender',
    title: 'Gender Distribution',
    chartType: 'doughnut',
    dataKey: 'gender',
    countLabel: 'PD_',
    percentageLabel: 'PTD_',
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 20,
            padding: 15,
            font: { size: 12 }
          }
        }
      }
    }
  },
  {
    name: 'division',
    title: 'Division Distribution',
    chartType: 'bar',
    dataKey: 'division',
    countLabel: 'YD_',
    percentageLabel: 'PTD_',
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  },
  {
    name: 'presentingIssues',
    title: 'Presenting Issues',
    chartType: 'bar',
    dataKey: 'presentingIssues',
    countLabel: 'YD_',
    percentageLabel: 'PTD_',
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { stacked: true },
        y: { stacked: true, beginAtZero: true }
      }
    }
  },
  {
    name: 'age',
    title: 'Age Distribution',
    chartType: 'bar',
    dataKey: 'age',
    countLabel: 'YD_',
    percentageLabel: 'PTD_',
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  },
  {
    name: 'referredBy',
    title: 'Referred By',
    chartType: 'doughnut',
    dataKey: 'referredBy',
    countLabel: 'YD_',
    percentageLabel: 'PTD_',
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 20,
            padding: 15,
            font: { size: 12 }
          }
        }
      }
    }
  },
  {
    name: 'workStatus',
    title: 'Work Status',
    chartType: 'doughnut',
    dataKey: 'workStatus',
    countLabel: 'YD_',
    percentageLabel: 'PTD_',
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 20,
            padding: 15,
            font: { size: 12 }
          }
        }
      }
    }
  },
  {
    name: 'education',
    title: 'Education',
    chartType: 'doughnut',
    dataKey: 'education',
    countLabel: 'YD_',
    percentageLabel: 'PTD_',
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 20,
            padding: 15,
            font: { size: 12 }
          }
        }
      }
    }
  }
];

const ChartSection: React.FC<ChartSectionProps> = ({ config, data, isVisible, onVisibilityChange }) => {
  const sectionData = data?.[config.dataKey];
  
  if (!sectionData) return null;

  const chartData = {
    labels: Object.keys(sectionData).filter(key => sectionData[key][config.countLabel] !== 0),
    datasets: [{
      data: Object.values(sectionData)
        .filter((item: any) => item[config.countLabel] !== 0)
        .map((item: any) => item[config.countLabel]),
      backgroundColor: [
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 99, 132, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)',
        'rgba(199, 199, 199, 0.6)',
        'rgba(83, 102, 255, 0.6)',
        'rgba(40, 159, 64, 0.6)',
        'rgba(210, 199, 199, 0.6)',
        'rgba(78, 52, 46, 0.6)',
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(199, 199, 199, 1)',
        'rgba(83, 102, 255, 1)',
        'rgba(40, 159, 64, 1)',
        'rgba(210, 199, 199, 1)',
        'rgba(78, 52, 46, 1)',
      ],
      borderWidth: 1,
    }]
  };

  return (
    <div className={`chart-section ${isVisible ? 'hidden' : ''}`}>
      <div className="chart-section-header">
        <h3>{config.title}</h3>
        <div className="switch-container">
          <span className="switch-label">Hide</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={isVisible}
              onChange={onVisibilityChange}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
      <div className="chart-section-content">
        <div className="chart-card">
          <ChartRenderer
            type={config.chartType}
            data={chartData}
            options={config.options}
          />
        </div>
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>{config.title}</th>
                <th>Count</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(sectionData)
                .filter(([_, value]) => (value as any)[config.countLabel] !== 0)
                .map(([key, value]) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{(value as any)[config.countLabel]}</td>
                    <td>{(value as any)[config.percentageLabel]}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ChartSection; 