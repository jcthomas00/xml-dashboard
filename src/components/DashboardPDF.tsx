import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { StatValue, DashboardData } from '../types/dashboard';
import html2canvas from 'html2canvas';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

// Register fonts
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold' }
  ]
});

// Add fallback fonts
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Helvetica/helvetica-regular.ttf' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Helvetica/helvetica-bold.ttf', fontWeight: 'bold' }
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chartContainer: {
    marginBottom: 20,
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    borderBottomStyle: 'solid',
    paddingVertical: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    paddingVertical: 5,
  },
  tableHeaderCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 12,
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    width: '30%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'solid',
  },
  statTitle: {
    fontSize: 10,
    color: '#666',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

interface DashboardPDFProps {
  data: DashboardData;
  trigger: boolean;
}

const DashboardPDF: React.FC<DashboardPDFProps> = ({ data, trigger }) => {
  const [chartImages, setChartImages] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (!trigger) return;

    const captureCharts = async () => {
      // Wait for the next frame to ensure charts are rendered
      await new Promise(resolve => requestAnimationFrame(resolve));
      
      const charts = {
        gender: document.querySelector('#gender-chart canvas'),
        division: document.querySelector('#division-chart canvas'),
        age: document.querySelector('#age-chart canvas'),
        workStatus: document.querySelector('#work-status-chart canvas'),
        education: document.querySelector('#education-chart canvas'),
        presentingIssues: document.querySelector('#presenting-issues-chart canvas'),
      };

      const images: Record<string, string> = {};
      
      for (const [key, element] of Object.entries(charts)) {
        if (element) {
          const canvas = element as HTMLCanvasElement;
          
          // Create a temporary container
          const tempContainer = document.createElement('div');
          tempContainer.style.position = 'fixed';
          tempContainer.style.top = '0';
          tempContainer.style.left = '0';
          tempContainer.style.width = '100%';
          tempContainer.style.height = '100%';
          tempContainer.style.backgroundColor = 'white';
          tempContainer.style.zIndex = '9999';
          tempContainer.style.display = 'flex';
          tempContainer.style.justifyContent = 'center';
          tempContainer.style.alignItems = 'center';
          
          // Clone the canvas
          const canvasClone = canvas.cloneNode(true) as HTMLCanvasElement;
          canvasClone.style.width = '600px';
          canvasClone.style.height = '400px';
          canvasClone.style.backgroundColor = 'white';
          
          // Copy the canvas content
          const ctx = canvasClone.getContext('2d');
          if (ctx) {
            ctx.drawImage(canvas, 0, 0);
          }
          
          tempContainer.appendChild(canvasClone);
          document.body.appendChild(tempContainer);
          
          try {
            // Wait for the canvas to be fully rendered
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const imageCanvas = await html2canvas(canvasClone, {
              scale: 2,
              useCORS: true,
              logging: false,
              backgroundColor: '#ffffff'
            });
            
            images[key] = imageCanvas.toDataURL('image/png');
          } finally {
            // Clean up
            document.body.removeChild(tempContainer);
          }
        }
      }
      
      setChartImages(images);
    };

    captureCharts();
  }, [trigger]);

  const renderSection = (title: string, data: Record<string, StatValue> | undefined | null, headerLabel: string, chartKey?: string) => {
    if (!data) return null;
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {chartKey && chartImages[chartKey] && (
          <View style={styles.chartContainer}>
            <Image 
              src={chartImages[chartKey]} 
              style={{ 
                width: '100%',
                height: 'auto',
                maxHeight: 300,
                objectFit: 'contain'
              }} 
            />
          </View>
        )}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>{headerLabel}</Text>
            <Text style={styles.tableHeaderCell}>Period to Date</Text>
            <Text style={styles.tableHeaderCell}>Year to Date</Text>
          </View>
          {Object.entries(data).map(([key, value]) => (
            <View key={key} style={styles.tableRow}>
              <Text style={styles.tableCell}>{key}</Text>
              <Text style={styles.tableCell}>{value.ptd}</Text>
              <Text style={styles.tableCell}>{value.ytd}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statTitle}>Total Cases</Text>
            <Text style={styles.statValue}>{data.totalCases}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statTitle}>Active Cases</Text>
            <Text style={styles.statValue}>{data.activeCases}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statTitle}>Closed Cases</Text>
            <Text style={styles.statValue}>{data.closedCases}</Text>
          </View>
        </View>

        {renderSection('Gender Distribution', data.gender, 'Gender', 'gender')}
        {renderSection('Division Distribution', data.division, 'Division', 'division')}
        {renderSection('Age Distribution', data.age, 'Age Range', 'age')}
        {renderSection('Work Status', data.workStatus, 'Status', 'workStatus')}
        {renderSection('Education', data.education, 'Level', 'education')}
        {renderSection('Presenting Issues', data.presentingIssues, 'Issue', 'presentingIssues')}
        {renderSection('Referred By', data.referredBy, 'Source')}
      </Page>
    </Document>
  );
};

export default DashboardPDF; 