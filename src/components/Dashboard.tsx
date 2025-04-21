import React, { useState, useMemo } from 'react';
import ChartRenderer from './ChartRenderer';
import FileUpload from './FileUpload';
import { parseXMLData } from '../utils/xmlParser';
import '../styles/Dashboard.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, ChartData } from 'chart.js';

// Register the CategoryScale
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

interface EducationItem {
  label: string;
  yd: number;
  ptd: string;
}

interface ChartVisibility {
  gender: boolean;
  division: boolean;
  age: boolean;
  presentingIssues: boolean;
  referredBy: boolean;
  workStatus: boolean;
  education: boolean;
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [chartVisibility, setChartVisibility] = useState<ChartVisibility>({
    gender: false,
    division: false,
    age: false,
    presentingIssues: false,
    referredBy: false,
    workStatus: false,
    education: false
  });

  const handleFileUpload = async (file: File) => {
    try {
      setLoading(true);
      setError(null);
      
      const text = await file.text();
      console.log('Raw XML text:', text);
      
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, 'text/xml');
      
      if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
        throw new Error('Invalid XML format');
      }
      
      const xmlString = new XMLSerializer().serializeToString(xmlDoc);
      console.log('Serialized XML string:', xmlString);
      
      const parsedData = await parseXMLData(xmlString);
      console.log('Parsed data:', parsedData);
      setData(parsedData);
    } catch (err) {
      setError('Error parsing XML file. Please ensure it matches the required format.');
      console.error('Error parsing XML:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatChartData = (rawData: any, type: 'pie' | 'bar') => {
    if (!rawData) {
      console.log(`No data available for ${type} chart`);
      return undefined;
    }

    console.log(`Formatting ${type} chart data:`, rawData);
    const labels = Object.keys(rawData);
    const values = Object.values(rawData).map((item: any) => parseFloat(item.ptd));

    const chartData = {
      labels,
      datasets: [{
        data: values,
        backgroundColor: type === 'pie' 
          ? ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
          : '#36A2EB'
      }]
    };
    console.log(`Formatted ${type} chart data:`, chartData);
    return chartData;
  };

  const divisionChartData = useMemo(() => {
    if (!data?.division) return undefined;

    const divisionEntries = Object.entries(data.division) as [string, { yd: number }][];
    const filteredData = divisionEntries
      .filter(([_, value]) => value.yd !== 0)
      .sort((a, b) => b[1].yd - a[1].yd);

    return {
      labels: filteredData.map(([key]) => key),
      datasets: [{
        label: 'Division Distribution',
        data: filteredData.map(([_, value]) => value.yd),
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
      }],
    };
  }, [data?.division]);

  const presentingIssuesData = useMemo(() => {
    if (!data?.presentingIssues) return undefined;

    type PresentingIssueValue = { yd: number; ptd: string };
    type GroupedData = Record<string, { issues: string[]; counts: number[] }>;

    // Group issues by MainCategory
    const groupedData = Object.entries(data.presentingIssues).reduce<GroupedData>((acc, [key, value]) => {
      const [mainCategory, issue] = key.split(' - ');
      if (!acc[mainCategory]) {
        acc[mainCategory] = {
          issues: [],
          counts: []
        };
      }
      acc[mainCategory].issues.push(issue);
      acc[mainCategory].counts.push((value as PresentingIssueValue).yd);
      return acc;
    }, {});

    // Filter out categories with zero total counts
    const filteredGroupedData = Object.entries(groupedData).reduce<GroupedData>((acc, [category, data]) => {
      const totalCount = data.counts.reduce((sum, count) => sum + count, 0);
      if (totalCount > 0) {
        acc[category] = data;
      }
      return acc;
    }, {});

    // Get unique issues across all categories
    const allIssues = new Set<string>();
    Object.values(filteredGroupedData).forEach((group: { issues: string[] }) => {
      group.issues.forEach((issue: string) => allIssues.add(issue));
    });
    const uniqueIssues = Array.from(allIssues);

    // Create datasets for each issue
    const datasets = uniqueIssues.map((issue, index) => {
      const colors = [
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
      ];

      return {
        label: issue,
        data: Object.keys(filteredGroupedData).map(category => {
          const categoryData = filteredGroupedData[category];
          const issueIndex = categoryData.issues.indexOf(issue);
          return issueIndex >= 0 ? categoryData.counts[issueIndex] : 0;
        }),
        backgroundColor: colors[index % colors.length],
        borderColor: colors[index % colors.length].replace('0.6', '1'),
        borderWidth: 1,
      };
    });

    return {
      labels: Object.keys(filteredGroupedData),
      datasets,
    };
  }, [data?.presentingIssues]);

  const referredByData = useMemo(() => {
    if (!data?.referredBy) return undefined;

    const typedData = Object.entries(data.referredBy) as [string, { yd: number; ptd: string }][];
    const filteredData = typedData
      .filter(([_, value]) => value.yd !== 0)
      .sort((a, b) => b[1].yd - a[1].yd);

    return {
      labels: filteredData.map(([key]) => key),
      datasets: [{
        data: filteredData.map(([_, value]) => value.yd),
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
      }],
    };
  }, [data?.referredBy]);

  const genderData = useMemo(() => {
    if (!data?.gender) return undefined;

    const typedData = Object.entries(data.gender) as [string, { yd: number; ptd: string }][];
    const filteredData = typedData
      .filter(([_, value]) => value.yd !== 0)
      .sort((a, b) => b[1].yd - a[1].yd);

    return {
      labels: filteredData.map(([key]) => key.charAt(0).toUpperCase() + key.slice(1)),
      datasets: [{
        data: filteredData.map(([_, value]) => value.yd),
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      }],
    };
  }, [data?.gender]);

  const ageData = useMemo(() => {
    if (!data?.age) return undefined;

    const typedData = Object.entries(data.age) as [string, { yd: number; ptd: string }][];
    const filteredData = typedData
      .filter(([_, value]) => value.yd !== 0)
      .sort((a, b) => b[1].yd - a[1].yd);

    return {
      labels: filteredData.map(([key]) => key),
      datasets: [{
        data: filteredData.map(([_, value]) => value.yd),
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
      }],
    };
  }, [data?.age]);

  const workStatusData = useMemo(() => {
    if (!data?.workStatus) return undefined;

    const workStatusEntries = Object.entries(data.workStatus) as [string, { yd: number }][];
    const filteredData = workStatusEntries
      .filter(([_, value]) => value.yd !== 0)
      .sort((a, b) => b[1].yd - a[1].yd);

    return {
      labels: filteredData.map(([key]) => key),
      datasets: [{
        label: 'Work Status Distribution',
        data: filteredData.map(([_, value]) => value.yd),
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      }],
    };
  }, [data?.workStatus]);

  // Group presenting issues by category
  const groupedIssues = useMemo(() => {
    if (!data?.presentingIssues) return {};
    
    return Object.entries(data.presentingIssues).reduce<Record<string, string[]>>((acc, [key, value]) => {
      const typedValue = value as { yd: number; ptd: string };
      if (typedValue.yd === 0) return acc;
      
      const [category, issue] = key.split(' - ');
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(issue);
      return acc;
    }, {});
  }, [data?.presentingIssues]);

  // Add education data processing
  const educationData = useMemo(() => {
    if (!data?.education) return [];
    return data.education.map((item: { label: string; yd: number; ptd: string }) => ({
      label: item.label,
      yd: item.yd,
      ptd: item.ptd
    }));
  }, [data?.education]);

  const totalEducation = useMemo(() => {
    if (!educationData.length) return 0;
    return educationData.reduce((sum: number, item: EducationItem) => sum + item.yd, 0);
  }, [educationData]);

  // Calculate totals for each section
  const totalDivision = useMemo(() => {
    if (!divisionChartData?.datasets?.[0]?.data) return 0;
    return divisionChartData.datasets[0].data.reduce((sum, count) => sum + count, 0);
  }, [divisionChartData]);

  const totalAge = useMemo(() => {
    if (!ageData?.datasets?.[0]?.data) return 0;
    return ageData.datasets[0].data.reduce((sum: number, count: number) => sum + count, 0);
  }, [ageData]);

  const totalReferredBy = useMemo(() => {
    if (!referredByData?.datasets?.[0]?.data) return 0;
    return referredByData.datasets[0].data.reduce((sum, count) => sum + count, 0);
  }, [referredByData]);

  const handleVisibilityChange = (chart: keyof ChartVisibility) => {
    setChartVisibility(prev => ({
      ...prev,
      [chart]: !prev[chart]
    }));
  };

  if (loading && !data) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <FileUpload onFileUpload={handleFileUpload} />
          <p>Please upload an XML file to view the dashboard</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-container">
          <FileUpload onFileUpload={handleFileUpload} />
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <FileUpload onFileUpload={handleFileUpload} />
      
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="button-group">
          <button className="print-button" onClick={() => window.print()}>
            Print as PDF
          </button>
        </div>
      </div>

      <div className="statistics-grid">
        <div className="stat-card">
          <h3>Total Clients</h3>
          <p>{data?.totalClients || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Total Cases</h3>
          <p>{data?.totalCases || 0}</p>
        </div>
        <div className="stat-card">
          <h3>EAP Cases</h3>
          <p>{data?.caseTypes?.eap?.ytd || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Worklife Cases</h3>
          <p>{data?.caseTypes?.worklife?.ytd || 0}</p>
        </div>
        <div className="stat-card utilization-card">
          <h3>Utilization Rate</h3>
          <div className="utilization-details">
            <div className="utilization-value">
              <span className="label">Current:</span>
              <span className="value">{data?.utilizationRate?.current || 0}%</span>
            </div>
            <div className="utilization-value">
              <span className="label">Yearly:</span>
              <span className="value">{data?.utilizationRate?.yearly || 0}%</span>
            </div>
            <div className="utilization-description">
              {data?.utilizationRate?.description}
            </div>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className={`chart-section ${chartVisibility.gender ? 'hidden' : ''}`}>
          <div className="chart-section-header">
            <h3>Gender Distribution</h3>
            <div className="switch-container">
              <span className="switch-label">Hide</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={chartVisibility.gender}
                  onChange={() => handleVisibilityChange('gender')}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
          <div className="chart-section-content">
            <div id="gender-chart" className="chart-card">
              <ChartRenderer
                type="doughnut"
                data={genderData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        boxWidth: 20,
                        padding: 15,
                        font: {
                          size: 12
                        }
                      }
                    }
                  }
                }}
              />
            </div>
            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Gender</th>
                    <th>Count</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {genderData?.labels?.map((label, index) => (
                    <tr key={label}>
                      <td>{label}</td>
                      <td>{genderData?.datasets?.[0]?.data?.[index] || 0}</td>
                      <td>{((genderData?.datasets?.[0]?.data?.[index] || 0) / totalEducation * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className={`chart-section ${chartVisibility.division ? 'hidden' : ''}`}>
          <div className="chart-section-header">
            <h3>Division Distribution</h3>
            <div className="switch-container">
              <span className="switch-label">Hide</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={chartVisibility.division}
                  onChange={() => handleVisibilityChange('division')}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
          <div className="chart-section-content">
            <div id="division-chart" className="chart-card">
              <ChartRenderer
                type="bar"
                data={divisionChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Division</th>
                    <th>Count</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {divisionChartData?.labels?.map((label, index) => (
                    <tr key={label}>
                      <td>{label}</td>
                      <td>{divisionChartData?.datasets?.[0]?.data?.[index] || 0}</td>
                      <td>{((divisionChartData?.datasets?.[0]?.data?.[index] || 0) / totalDivision * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className={`chart-section ${chartVisibility.presentingIssues ? 'hidden' : ''}`}>
          <div className="chart-section-header">
            <h3>Presenting Issues</h3>
            <div className="switch-container">
              <span className="switch-label">Hide</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={chartVisibility.presentingIssues}
                  onChange={() => handleVisibilityChange('presentingIssues')}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
          <div className="chart-section-content">
            <div className="chart-card">
              <ChartRenderer
                type="bar"
                data={presentingIssuesData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      stacked: true,
                      title: {
                        display: false
                      }
                    },
                    y: {
                      stacked: true,
                      beginAtZero: true,
                      title: {
                        display: false
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      display: false
                    },
                    title: {
                      display: true,
                      text: 'Presenting Issues by Category',
                      font: {
                        size: 16
                      }
                    }
                  }
                }}
              />
            </div>
            <div className="data-table">
              {Object.entries(groupedIssues).map(([category, issues]) => (
                <div key={category} className="category-group">
                  <details>
                    <summary className="category-header">
                      <span className="category-title">{category}</span>
                      <span className="category-total">
                        {issues.reduce((sum: number, issue: string) => sum + (data?.presentingIssues?.[`${category} - ${issue}`]?.yd || 0), 0)} cases
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
                        {issues.map((issue: string) => {
                          const count = data?.presentingIssues?.[`${category} - ${issue}`]?.yd || 0;
                          const percentage = data?.presentingIssues?.[`${category} - ${issue}`]?.ptd || '0%';
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

        <div className={`chart-section ${chartVisibility.age ? 'hidden' : ''}`}>
          <div className="chart-section-header">
            <h3>Age Distribution</h3>
            <div className="switch-container">
              <span className="switch-label">Hide</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={chartVisibility.age}
                  onChange={() => handleVisibilityChange('age')}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
          <div className="chart-section-content">
            <div id="age-chart" className="chart-card">
              <ChartRenderer
                type="bar"
                data={formatChartData(data?.age, 'bar')}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Age Range</th>
                    <th>Count</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {ageData?.labels?.map((label: string, index: number) => (
                    <tr key={label}>
                      <td>{label}</td>
                      <td>{ageData?.datasets?.[0]?.data?.[index] || 0}</td>
                      <td>{((ageData?.datasets?.[0]?.data?.[index] || 0) / totalAge * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className={`chart-section ${chartVisibility.referredBy ? 'hidden' : ''}`}>
          <div className="chart-section-header">
            <h3>Referred By</h3>
            <div className="switch-container">
              <span className="switch-label">Hide</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={chartVisibility.referredBy}
                  onChange={() => handleVisibilityChange('referredBy')}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
          <div className="chart-section-content">
            <div className="chart-card">
              <ChartRenderer
                type="doughnut"
                data={referredByData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        boxWidth: 20,
                        padding: 15,
                        font: {
                          size: 12
                        }
                      }
                    }
                  }
                }}
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
                  {referredByData?.labels?.map((label, index) => (
                    <tr key={label}>
                      <td>{label}</td>
                      <td>{referredByData?.datasets?.[0]?.data?.[index] || 0}</td>
                      <td>{((referredByData?.datasets?.[0]?.data?.[index] || 0) / totalReferredBy * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className={`chart-section ${chartVisibility.workStatus ? 'hidden' : ''}`}>
          <div className="chart-section-header">
            <h3>Work Status</h3>
            <div className="switch-container">
              <span className="switch-label">Hide</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={chartVisibility.workStatus}
                  onChange={() => handleVisibilityChange('workStatus')}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
          <div className="chart-section-content">
            <div id="work-status-chart" className="chart-card">
              <ChartRenderer
                type="doughnut"
                data={workStatusData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        boxWidth: 20,
                        padding: 15,
                        font: {
                          size: 12
                        }
                      }
                    }
                  }
                }}
              />
            </div>
            <div className="data-table">
              {data?.workStatus && (
                <div className="data-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Status</th>
                        <th>Percentage</th>
                        <th>Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(data.workStatus)
                        .filter(([_, value]) => (value as { yd: number }).yd !== 0)
                        .sort((a, b) => (b[1] as { yd: number }).yd - (a[1] as { yd: number }).yd)
                        .map(([key, value]) => (
                          <tr key={key}>
                            <td>{key}</td>
                            <td>{(value as { ptd: string }).ptd}</td>
                            <td>{(value as { yd: number }).yd}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={`chart-section ${chartVisibility.education ? 'hidden' : ''}`}>
          <div className="chart-section-header">
            <h3>Education</h3>
            <div className="switch-container">
              <span className="switch-label">Hide</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={chartVisibility.education}
                  onChange={() => handleVisibilityChange('education')}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
          <div className="chart-section-content">
            <div id="education-chart" className="chart-card">
              <ChartRenderer
                type="doughnut"
                data={formatChartData(data?.education, 'pie')}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        boxWidth: 20,
                        padding: 15,
                        font: {
                          size: 12
                        }
                      }
                    }
                  }
                }}
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
                  {educationData.map((item: EducationItem, index: number) => (
                    <tr key={index}>
                      <td>{item.label}</td>
                      <td>{item.yd}</td>
                      <td>{((item.yd / totalEducation) * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 