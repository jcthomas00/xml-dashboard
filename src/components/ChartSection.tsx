import React from 'react';
import ChartRenderer from './ChartRenderer';
import { ChartType } from 'chart.js';

// Theme configuration
interface Theme {
  colors: {
    primary: string[];
    border: string[];
    hover: string[];
  };
  options: {
    borderWidth: number;
    hoverBorderWidth: number;
  };
}

const warmTheme: Theme = {
  colors: {
    primary: [
      'rgba(0, 94, 32, 0.6)',     // #005e20
      'rgba(255, 193, 37, 0.6)',  // #ffc125
      'rgba(255, 140, 0, 0.6)', // #ff8c00
      'rgba(91, 47, 19, 0.6)',    // #5b2f13
      'rgba(205, 198, 115, 0.6)', // #cdc673
      'rgba(255, 235, 205, 0.6)', // #ffebcd
    ],
    border: [
      'rgba(0, 94, 32, 1)',
      'rgba(255, 193, 37, 1)',
      'rgba(255, 140, 0, 1)', // #ff8c00
      'rgba(91, 47, 19, 1)',
      'rgba(205, 198, 115, 1)',
      'rgba(255, 235, 205, 1)',
    ],
    hover: [
      'rgba(0, 94, 32, 0.8)',
      'rgba(255, 193, 37, 0.8)',
      'rgba(255, 140, 0, 0.8)', // #ff8c00
      'rgba(91, 47, 19, 0.8)',
      'rgba(205, 198, 115, 0.8)',
      'rgba(255, 235, 205, 0.8)',
    ],
  },
  options: {
    borderWidth: 1,
    hoverBorderWidth: 2,
  },
};

const currentTheme = warmTheme;

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
  },
  {
    name: 'casesOpened',
    title: 'Cases Opened',
    chartType: 'bar',
    dataKey: 'CS_CasesOpened2',
    countLabel: 'PD_',
    percentageLabel: 'PTD_',
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Number of Cases'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Case Type'
          }
        }
      }
    }
  },
  {
    name: 'urgency',
    title: 'Urgency of the Case',
    chartType: 'doughnut',
    dataKey: 'Urgency',
    countLabel: 'PD_1',
    percentageLabel: 'Textbox24',
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
    name: 'awareEAP',
    title: 'Aware of EAP From',
    chartType: 'bar',
    dataKey: 'awareEAP',
    countLabel: 'PD_',
    percentageLabel: 'PTD_',
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
            text: 'Source'
          }
        }
      }
    }
  },
  {
    name: 'priorEAP',
    title: 'Prior EAP Usage',
    chartType: 'doughnut',
    dataKey: 'priorEAP',
    countLabel: 'YD_',
    percentageLabel: 'PTD_2',
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
    name: 'maritalStatus',
    title: 'Marital Status',
    chartType: 'bar',
    dataKey: 'maritalStatus',
    countLabel: 'YD_',
    percentageLabel: 'PTD_',
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
            text: 'Marital Status'
          }
        }
      }
    }
  },
  {
    name: 'ethnicity',
    title: 'Ethnic Background',
    chartType: 'bar',
    dataKey: 'ethnicity',
    countLabel: 'YD_',
    percentageLabel: 'PTD_',
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
            text: 'Ethnic Background'
          }
        }
      }
    }
  },
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

interface UrgencyDetail {
  Optionskey1: string;
  PD_1: string;
  Textbox24: string;
  Textbox28: string;
  Textbox44: string;
}

interface UrgencyData {
  Report: {
    Tablix3: {
      Details_Collection: {
        Details: UrgencyDetail[];
      };
    };
  };
}

const ChartSection: React.FC<ChartSectionProps> = ({ config, data, isVisible, onVisibilityChange }) => {
  // Try both direct access and XML structure
  const sectionData = data?.[config.dataKey];
  const xmlData = data?.[config.dataKey]?.Report?.Tablix3?.Details_Collection?.Details as TableItem[];
  
  if (!sectionData && !xmlData) return null;

  // For urgency section, we need to handle the XML structure
  if (config.name === 'urgency') {
    if (data?.Urgency) {
      const urgencyData = data.Urgency as UrgencyData;
      const details = urgencyData?.Report?.Tablix3?.Details_Collection?.Details;
      
      if (!details) {
        return null;
      }

      const filteredData = details
        .map(item => ({
          key: item.Optionskey1,
          count: parseInt(item.PD_1),
          percentage: item.Textbox24
        }))
        .filter(item => item.count !== 0)
        .sort((a, b) => b.count - a.count);

      const chartData = {
        labels: filteredData.map(item => item.key),
        datasets: [{
          data: filteredData.map(item => item.count),
          backgroundColor: currentTheme.colors.primary,
          borderColor: currentTheme.colors.border,
          borderWidth: currentTheme.options.borderWidth,
          hoverBackgroundColor: currentTheme.colors.hover,
          hoverBorderWidth: currentTheme.options.hoverBorderWidth,
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
                    <th>Urgency Level</th>
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
  }

  // For cases opened section, we need to handle the XML structure
  if (config.name === 'casesOpened' && xmlData) {
    const filteredData = xmlData
      .filter((item: TableItem) => item.Detail_Collection?.Detail)
      .map((item: TableItem) => ({
        key: item.Detail_Collection.Detail.Optionskey as string,
        count: parseInt(item.Detail_Collection.Detail.PD_ as string),
        percentage: item.Detail_Collection.Detail.PTD_ as string,
        ytd: item.Detail_Collection.Detail.YTD_ as string
      }))
      .filter(item => item.count !== 0)
      .sort((a, b) => b.count - a.count);

    const chartData = {
      labels: filteredData.map(item => item.key),
      datasets: [{
        label: 'Number of Cases',
        data: filteredData.map(item => item.count),
        backgroundColor: currentTheme.colors.primary,
        borderColor: currentTheme.colors.border,
        borderWidth: currentTheme.options.borderWidth,
        hoverBackgroundColor: currentTheme.colors.hover,
        hoverBorderWidth: currentTheme.options.hoverBorderWidth,
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
                  <th>Case Type</th>
                  <th>Count</th>
                  <th>Percentage</th>
                  <th>Year to Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map(item => (
                  <tr key={item.key}>
                    <td>{item.key}</td>
                    <td>{item.count}</td>
                    <td>{item.percentage}</td>
                    <td>{item.ytd}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

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
        backgroundColor: currentTheme.colors.primary,
        borderColor: currentTheme.colors.border,
        borderWidth: currentTheme.options.borderWidth,
        hoverBackgroundColor: currentTheme.colors.hover,
        hoverBorderWidth: currentTheme.options.hoverBorderWidth,
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
        backgroundColor: currentTheme.colors.primary[index % 5],
        borderColor: currentTheme.colors.border[index % 5],
        borderWidth: currentTheme.options.borderWidth,
        hoverBackgroundColor: currentTheme.colors.hover[index % 5],
        hoverBorderWidth: currentTheme.options.hoverBorderWidth,
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

  // For awareEAP section
  if (config.name === 'awareEAP' && data?.awareEAP) {
    const filteredData = Object.entries(data.awareEAP)
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
        label: 'Number of Clients',
        data: filteredData.map(item => item.count),
        backgroundColor: currentTheme.colors.primary,
        borderColor: currentTheme.colors.border,
        borderWidth: currentTheme.options.borderWidth,
        hoverBackgroundColor: currentTheme.colors.hover,
        hoverBorderWidth: currentTheme.options.hoverBorderWidth,
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
                  <th>Source</th>
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

  // For priorEAP section
  if (config.name === 'priorEAP' && data?.priorEAP) {
    const filteredData = Object.entries(data.priorEAP)
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
        backgroundColor: currentTheme.colors.primary,
        borderColor: currentTheme.colors.border,
        borderWidth: currentTheme.options.borderWidth,
        hoverBackgroundColor: currentTheme.colors.hover,
        hoverBorderWidth: currentTheme.options.hoverBorderWidth,
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
                  <th>Usage</th>
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

  // For maritalStatus section
  if (config.name === 'maritalStatus' && data?.maritalStatus) {
    const filteredData = Object.entries(data.maritalStatus)
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
        label: 'Number of Clients',
        data: filteredData.map(item => item.count),
        backgroundColor: currentTheme.colors.primary,
        borderColor: currentTheme.colors.border,
        borderWidth: currentTheme.options.borderWidth,
        hoverBackgroundColor: currentTheme.colors.hover,
        hoverBorderWidth: currentTheme.options.hoverBorderWidth,
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
                  <th>Marital Status</th>
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

  // For ethnicity section
  if (config.name === 'ethnicity' && data?.ethnicity) {
    const filteredData = Object.entries(data.ethnicity)
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
        label: 'Number of Clients',
        data: filteredData.map(item => item.count),
        backgroundColor: currentTheme.colors.primary,
        borderColor: currentTheme.colors.border,
        borderWidth: currentTheme.options.borderWidth,
        hoverBackgroundColor: currentTheme.colors.hover,
        hoverBorderWidth: currentTheme.options.hoverBorderWidth,
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
                  <th>Ethnic Background</th>
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
        backgroundColor: currentTheme.colors.primary,
        borderColor: currentTheme.colors.border,
        borderWidth: currentTheme.options.borderWidth,
        hoverBackgroundColor: currentTheme.colors.hover,
        hoverBorderWidth: currentTheme.options.hoverBorderWidth,
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