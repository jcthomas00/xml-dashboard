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
    chartType: 'bar',
    dataKey: 'education',
    countLabel: 'Textbox14',
    percentageLabel: 'Textbox15',
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Number of Clients'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Education Level'
          }
        }
      }
    }
  }
];

interface Detail {
  Optionskey: string;
  [key: string]: string | number;
}

interface DetailCollection {
  Detail: Detail;
}

interface TableItem {
  Detail_Collection: DetailCollection;
}

interface GroupedData {
  issues: string[];
  counts: number[];
}

const ChartSection: React.FC<ChartSectionProps> = ({ config, data, isVisible, onVisibilityChange }) => {
  // Try both direct access and XML structure
  const sectionData = data?.[config.dataKey];
  const xmlData = data?.[config.dataKey]?.Report?.table1?.table1_Optionskey_Collection?.table1_Optionskey as TableItem[];
  
  if (!sectionData && !xmlData) return null;

  // For education section, we need to handle the array of objects format
  if (config.name === 'education' && Array.isArray(sectionData)) {
    const filteredData = sectionData
      .map(item => ({
        key: item.label,
        count: item.yd,
        percentage: item.ptd
      }))
      .filter(item => item.count !== 0)
      .sort((a, b) => b.count - a.count);

    const chartData = {
      labels: filteredData.map(item => item.key),
      datasets: [{
        label: 'Number of Clients',
        data: filteredData.map(item => item.count),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
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
                  <th>Education Level</th>
                  <th>Count</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map(item => (
                  <tr key={item.key}>
                    <td>{item.key}</td>
                    <td>{item.count}</td>
                    <td>{item.percentage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // For presenting issues, we need to handle the grouped data differently
  if (config.name === 'presentingIssues' && sectionData) {
    const groupedData = Object.entries(sectionData).reduce<Record<string, GroupedData>>((acc: Record<string, GroupedData>, [key, value]: [string, any]) => {
      const [mainCategory, issue] = key.split(' - ');
      if (!acc[mainCategory]) {
        acc[mainCategory] = {
          issues: [],
          counts: []
        };
      }
      acc[mainCategory].issues.push(issue);
      acc[mainCategory].counts.push(value.yd);
      return acc;
    }, {});

    const filteredGroupedData = Object.entries(groupedData).reduce<Record<string, GroupedData>>((acc: Record<string, GroupedData>, [category, data]: [string, GroupedData]) => {
      const totalCount = data.counts.reduce((sum: number, count: number) => sum + count, 0);
      if (totalCount > 0) {
        acc[category] = data;
      }
      return acc;
    }, {});

    const allIssues = new Set<string>();
    Object.values(filteredGroupedData).forEach((group: GroupedData) => {
      group.issues.forEach((issue: string) => allIssues.add(issue));
    });
    const uniqueIssues = Array.from(allIssues);

    const datasets = uniqueIssues.map((issue: string, index: number) => {
      return {
        label: issue,
        data: Object.keys(filteredGroupedData).map(category => {
          const categoryData = filteredGroupedData[category];
          const issueIndex = categoryData.issues.indexOf(issue);
          return issueIndex >= 0 ? categoryData.counts[issueIndex] : 0;
        }),
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
        ][index % 11],
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
        ][index % 11],
        borderWidth: 1,
      };
    });

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
              data={{
                labels: Object.keys(filteredGroupedData),
                datasets,
              }}
              options={config.options}
            />
          </div>
          <div className="data-table">
            {Object.entries(filteredGroupedData).map(([category, data]) => (
              <div key={category} className="category-group">
                <details>
                  <summary className="category-header">
                    <span className="category-title">{category}</span>
                    <span className="category-total">
                      {data.counts.reduce((sum: number, count: number) => sum + count, 0)} cases
                    </span>
                  </summary>
                  <table>
                    <thead>
                      <tr>
                        <th>Issue</th>
                        <th>Count</th>
                        <th>Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.issues.map((issue: string, index: number) => {
                        const count = data.counts[index];
                        const detail = sectionData[`${category} - ${issue}`];
                        const percentage = detail?.ptd || '0%';
                        return (
                          <tr key={issue}>
                            <td>{issue}</td>
                            <td>{count}</td>
                            <td>{percentage}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </details>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // For all other sections
  if (sectionData) {
    const filteredData = Object.entries(sectionData)
      .map(([key, value]: [string, any]) => ({
        key,
        count: value.yd,
        percentage: value.ptd
      }))
      .filter(item => item.count !== 0)
      .sort((a, b) => b.count - a.count);

    const chartData = {
      labels: filteredData.map(item => item.key),
      datasets: [{
        data: filteredData.map(item => item.count),
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
                {filteredData.map(item => (
                  <tr key={item.key}>
                    <td>{item.key}</td>
                    <td>{item.count}</td>
                    <td>{item.percentage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ChartSection; 