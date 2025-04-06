import React, { useEffect, useState } from 'react';
import { DashboardData, parseXMLData } from '../utils/xmlParser';
import DashboardPDF from './DashboardPDF';
import ChartRenderer, { getProfessionalColors } from './ChartRenderer';
import PDFDownloadWrapper from './PDFDownloadWrapper';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/UTMB.xml');
        const xmlString = await response.text();
        const parsedData = await parseXMLData(xmlString);
        setData(parsedData);
      } catch (error) {
        console.error('Error fetching or parsing data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>Error loading data</div>;
  }

  // Prepare data for gender distribution chart
  const genderData = {
    labels: Object.keys(data.gender).map(label => label.charAt(0).toUpperCase() + label.slice(1)),
    datasets: [{
      data: Object.values(data.gender).map((stats: any) => parseFloat(stats.ptd)),
      backgroundColor: getProfessionalColors(Object.keys(data.gender).length),
      totalCount: Object.values(data.gender).reduce((sum, stats: any) => sum + parseInt(stats.pd), 0)
    }]
  };

  // Prepare data for division distribution chart
  const divisionData = {
    labels: Object.entries(data.division)
      .filter(([_, stats]: [string, any]) => parseFloat(stats.ptd) > 0)
      .map(([division]) => division),
    datasets: [{
      label: 'Division Distribution',
      data: Object.entries(data.division)
        .filter(([_, stats]: [string, any]) => parseFloat(stats.ptd) > 0)
        .map(([_, stats]: [string, any]) => parseFloat(stats.ptd)),
      backgroundColor: getProfessionalColors(Object.keys(data.division).length)
    }]
  };

  const presentingIssuesData = {
    labels: Object.keys(data.presentingIssues),
    datasets: [{
      data: Object.values(data.presentingIssues).map((stats: any) => parseFloat(stats.ptd))
    }]
  };

  // Prepare data for age distribution chart
  const ageData = {
    datasets: Object.entries(data.age)
      .filter(([_, stats]: [string, any]) => parseFloat(stats.ptd) > 0)
      .map(([age, stats]: [string, any], index: number) => ({
        label: age,
        data: [{
          x: parseInt(age), // Convert age to number for x-axis
          y: parseFloat(stats.ptd), // Percentage for y-axis
          r: parseInt(stats.pd) // Count for bubble size
        }],
        backgroundColor: getProfessionalColors(1)[0] // Get a unique color for each age group
      }))
  };

  // Add options for bubble chart
  const bubbleChartOptions = {
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: 'Age'
        }
      },
      y: {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: 'Percentage'
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const data = context.raw;
            return [
              `Age: ${data.x}`,
              `Count: ${data.r}`,
              `Percentage: ${data.y}%`
            ];
          }
        }
      },
      legend: {
        display: false
      }
    }
  };

  // Filter out zero values and create new datasets
  const filterZeroValues = (originalData: any) => {
    const filteredLabels: string[] = [];
    const filteredData: number[] = [];
    
    // Filter out zero values
    originalData.labels.forEach((label: string, index: number) => {
      const value = originalData.datasets[0].data[index];
      if (value > 0) {
        filteredLabels.push(label);
        filteredData.push(value);
      }
    });
    
    // Create new dataset with filtered data
    return {
      labels: filteredLabels,
      datasets: [{
        ...originalData.datasets[0],
        data: filteredData
      }]
    };
  };

  // Sort data in descending order
  const sortDataDescending = (data: any) => {
    const sortedIndices = data.datasets[0].data
      .map((value: number, index: number) => ({ value, index }))
      .sort((a: any, b: any) => b.value - a.value)
      .map((item: any) => item.index);
    
    return {
      labels: sortedIndices.map((index: number) => data.labels[index]),
      datasets: [{
        ...data.datasets[0],
        data: sortedIndices.map((index: number) => data.datasets[0].data[index])
      }]
    };
  };

  // Filter and sort data for charts
  const filteredGenderData = sortDataDescending(filterZeroValues(genderData));
  const filteredDivisionData = sortDataDescending(filterZeroValues(divisionData));
  const filteredPresentingIssuesData = sortDataDescending(filterZeroValues(presentingIssuesData));

  // Filter and sort data for tables
  const getFilteredTableData = (data: any) => {
    return Object.entries(data)
      .filter(([_, stats]: [string, any]) => parseFloat(stats.ptd) > 0)
      .sort((a: any, b: any) => parseFloat(b[1].ptd) - parseFloat(a[1].ptd));
  };

  const filteredGenderTableData = getFilteredTableData(data.gender);
  const filteredDivisionTableData = getFilteredTableData(data.division);
  const filteredPresentingIssuesTableData = getFilteredTableData(data.presentingIssues);
  const filteredReferralSourceTableData = getFilteredTableData(data.referralSource);

  // Prepare data for referral source chart
  const referralSourceData = {
    labels: Object.keys(data.referralSource),
    datasets: [{
      data: Object.values(data.referralSource).map((stats: any) => parseFloat(stats.ptd)),
      totalCount: Object.values(data.referralSource).reduce((sum, stats: any) => sum + parseInt(stats.pd), 0)
    }]
  };

  // Filter and sort referral source data
  const filteredReferralSourceData = sortDataDescending(filterZeroValues(referralSourceData));

  // Prepare referral source table data
  const referralSourceTableData = Object.entries(data.referralSource)
    .filter(([_, stats]: [string, any]) => parseFloat(stats.ptd) > 0)
    .sort((a: any, b: any) => parseFloat(b[1].ptd) - parseFloat(a[1].ptd));

  // Group presenting issues by category
  const groupedPresentingIssues = Object.entries(data.presentingIssues).reduce((acc: any, [key, value]: [string, any]) => {
    const [category, issue] = key.split(' - ');
    if (!acc[category]) {
      acc[category] = {
        issues: {},
        total: 0
      };
    }
    acc[category].issues[issue] = value;
    acc[category].total += parseFloat(value.ptd);
    return acc;
  }, {});

  // Prepare data for stacked bar chart
  const categories = Object.keys(groupedPresentingIssues);
  const issues = new Set<string>();
  Object.values(groupedPresentingIssues).forEach((category: any) => {
    Object.keys(category.issues).forEach(issue => issues.add(issue));
  });
  const uniqueIssues = Array.from(issues);

  const stackedPresentingIssuesData = {
    labels: categories.filter(category => groupedPresentingIssues[category].total > 0),
    datasets: uniqueIssues.map((issue) => ({
      label: issue,
      data: categories
        .filter(category => groupedPresentingIssues[category].total > 0)
        .map(category => {
          const value = groupedPresentingIssues[category].issues[issue]?.ptd || '0';
          return parseFloat(value);
        }),
      backgroundColor: getProfessionalColors(uniqueIssues.length)
    }))
  };

  return (
    <div className="dashboard">
      <h1>UTMB EAP Dashboard</h1>
      
      <div className="dashboard-header">
        <div className="stat-card">
          <h3>Employees Covered</h3>
          <p>{data.employeesCovered}</p>
        </div>
        <div className="stat-card">
          <h3>Total Cases</h3>
          <p>PD: {Number(data.casesByType.eap.pd) + Number(data.casesByType.wl.pd)} | YTD: {Number(data.casesByType.eap.ytd) + Number(data.casesByType.wl.ytd)}</p>
        </div>
        <div className="stat-card">
          <h3>Cases by Type (EAP)</h3>
          <p>PD: {data.casesByType.eap.pd} | YTD: {data.casesByType.eap.ytd}</p>
        </div>
        <div className="stat-card">
          <h3>Cases by Type (W/L)</h3>
          <p>PD: {data.casesByType.wl.pd} | YTD: {data.casesByType.wl.ytd}</p>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-section">
          <h3 className="section-title">Gender Distribution</h3>
          <div className="chart-content">
            <div className="chart-container">
              <ChartRenderer type="pie" data={genderData} />
            </div>
            <div className="data-table">
              {Object.entries(data.gender)
                .filter(([_, stats]: [string, any]) => parseFloat(stats.ptd) > 0)
                .map(([gender, stats]: [string, any]) => (
                  <div key={gender} className="table-row">
                    <div className="table-cell">{gender.charAt(0).toUpperCase() + gender.slice(1)}</div>
                    <div className="table-cell">{stats.pd}</div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        
        <div className="chart-section">
          <h3 className="section-title">Division Distribution</h3>
          <div className="chart-content">
            <div className="chart-container">
              <ChartRenderer type="horizontalBar" data={divisionData} />
            </div>
            <div className="data-table">
              {Object.entries(data.division)
                .filter(([_, stats]: [string, any]) => parseFloat(stats.ptd) > 0)
                .sort((a: any, b: any) => parseFloat(b[1].ptd) - parseFloat(a[1].ptd))
                .map(([division, stats]: [string, any]) => (
                  <div key={division} className="table-row">
                    <div className="table-cell">{division}</div>
                    <div className="table-cell">{stats.pd}</div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        
        <div className="chart-section">
          <h3 className="section-title">Presenting Issues</h3>
          <div className="chart-content">
            <div className="chart-container">
              <ChartRenderer 
                type="bar" 
                data={stackedPresentingIssuesData}
                options={{
                  animation: false,
                  scales: {
                    x: {
                      stacked: true,
                      title: {
                        display: false
                      }
                    },
                    y: {
                      stacked: true,
                      title: {
                        display: false
                      },
                      ticks: {
                        callback: (value: any) => `${value}%`
                      }
                    }
                  },
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: (context: any) => {
                          const value = context.raw;
                          return `${context.dataset.label}: ${value}%`;
                        }
                      }
                    }
                  }
                }}
              />
            </div>
            <div className="data-table">
              {Object.entries(groupedPresentingIssues)
                .filter(([_, category]: [string, any]) => category.total > 0)
                .sort((a: any, b: any) => b[1].total - a[1].total)
                .map(([category, data]: [string, any]) => (
                  <div key={category} className="category-group">
                    <div className="category-header">
                      <div className="table-cell">{category}</div>
                      <div className="table-cell">{data.total.toFixed(1)}%</div>
                    </div>
                    {Object.entries(data.issues)
                      .filter(([_, stats]: [string, any]) => parseFloat(stats.ptd) > 0)
                      .sort((a: any, b: any) => parseFloat(b[1].ptd) - parseFloat(a[1].ptd))
                      .map(([issue, stats]: [string, any]) => (
                        <div key={issue} className="table-row issue-row">
                          <div className="table-cell">{issue}</div>
                          <div className="table-cell">{stats.pd}</div>
                        </div>
                      ))}
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="chart-section">
          <h3 className="section-title">Age Distribution</h3>
          <div className="chart-content">
            <div className="chart-container">
              <ChartRenderer type="bubble" data={ageData} options={bubbleChartOptions} />
            </div>
            <div className="data-table">
              {Object.entries(data.age)
                .filter(([_, stats]: [string, any]) => parseFloat(stats.ptd) > 0)
                .map(([age, stats]: [string, any]) => (
                  <div key={age} className="table-row">
                    <div className="table-cell">{age}</div>
                    <div className="table-cell">{stats.pd}</div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="chart-section">
          <h3 className="section-title">Referral Source</h3>
          <div className="chart-content">
            <div className="chart-container">
              <ChartRenderer type="pie" data={filteredReferralSourceData} />
            </div>
            <div className="data-table">
              {referralSourceTableData.map(([source, stats]: [string, any]) => (
                <div key={source} className="table-row">
                  <div className="table-cell">{source}</div>
                  <div className="table-cell">{stats.pd}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pdf-download">
        <PDFDownloadWrapper document={<DashboardPDF data={data} />} fileName="dashboard.pdf">
          {({ loading: pdfLoading, error }) => (
            <button className="download-button">
              {pdfLoading ? 'Generating PDF...' : 'Download PDF'}
            </button>
          )}
        </PDFDownloadWrapper>
      </div>
    </div>
  );
};

export default Dashboard; 