import React, { useState } from 'react';
import FileUpload from './FileUpload';
import { parseXMLData, DashboardData } from '../utils/xmlParser';
import '../styles/Dashboard.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import ChartSection, { CHART_SECTIONS } from './ChartSection';

// Register the CategoryScale
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

interface ChartVisibility {
  [key: string]: boolean;
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [periodText, setPeriodText] = useState<string>("Client Company | Period: 01-01-2025 - 01-31-2025");
  const [chartVisibility, setChartVisibility] = useState<ChartVisibility>(
    CHART_SECTIONS.reduce((acc, section) => {
      acc[section.name] = false;
      return acc;
    }, {} as ChartVisibility)
  );

  const handleFileUpload = async (file: File) => {
    try {
      setLoading(true);
      setError(null);
      
      const text = await file.text();
      
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, 'text/xml');
      
      if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
        throw new Error('Invalid XML format');
      }
      
      const xmlString = new XMLSerializer().serializeToString(xmlDoc);
      
      const parsedData = await parseXMLData(xmlString);
      setData(parsedData);
    } catch (err) {
      setError('Error parsing XML file. Please ensure it matches the required format.');
      console.error('Error parsing XML:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVisibilityChange = (chart: string) => {
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
      <div className="dashboard-header">
        <div className="button-group no-print">
          <FileUpload onFileUpload={handleFileUpload} />
          <button className="print-button" onClick={() => window.print()}>
            Print as PDF
          </button>
        </div>
        <div className="title-row">
          <img src="https://www.uth.edu/uteap/assets/img/logo.jpg" alt="UTEAP Logo" className="uteap-logo" />
          <h1>UTEAP Client Services Report</h1>
        </div>
        <input 
          type="text" 
          className="period-input" 
          value={periodText}
          onChange={(e) => setPeriodText(e.target.value)}
        />
      </div>

      <div className="statistics-grid">
        <div className="stat-card">
          <h3>Total Clients</h3>
          <p>{data?.totalClients || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Total New Cases</h3>
          <p>{data?.totalCases || 0}</p>
        </div>
        <div className="stat-card">
          <h3>New EAP Cases</h3>
          <p>{data?.caseTypes?.eap?.ytd || 0}</p>
        </div>
        <div className="stat-card">
          <h3>EAP Cases Closed</h3>
          <p>{data?.casesClosed?.eap?.pd || 0}</p>
        </div>
        <div className="stat-card">
          <h3>New Worklife Cases</h3>
          <p>{data?.caseTypes?.worklife?.ytd || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Worklife Cases Closed</h3>
          <p>{data?.casesClosed?.worklife?.pd || 0}</p>
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
        {CHART_SECTIONS.map(section => (
          <ChartSection
            key={section.name}
            config={section}
            data={data}
            isVisible={chartVisibility[section.name]}
            onVisibilityChange={() => handleVisibilityChange(section.name)}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard; 