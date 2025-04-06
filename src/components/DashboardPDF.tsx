import React, { useRef, useEffect, useState } from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { DashboardData } from '../utils/xmlParser';
import ChartRenderer from './ChartRenderer';
import html2canvas from 'html2canvas';

// Register a sans-serif font for better typography
Font.register({
  family: 'Open Sans',
  src: 'https://fonts.gstatic.com/s/opensans/v34/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0B4gaVQUwaEQbjB_mQ.woff'
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Open Sans',
    fontSize: 12,
    color: '#333333',
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#1a237e',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666666',
  },
  reportPeriod: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666666',
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 4,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1a237e',
    backgroundColor: '#e8eaf6',
    padding: 8,
    borderRadius: 4,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    paddingVertical: 8,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    paddingVertical: 8,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  col: {
    flex: 1,
  },
  col2: {
    flex: 2,
  },
  col3: {
    flex: 3,
  },
  label: {
    color: '#666666',
  },
  value: {
    color: '#333333',
    fontWeight: 'bold',
  },
  summaryBox: {
    backgroundColor: '#e8eaf6',
    padding: 15,
    marginBottom: 20,
    borderRadius: 4,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1a237e',
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: '#666666',
    fontSize: 10,
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    paddingTop: 10,
  },
  chartContainer: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: 'white',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  },
  chartTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1a237e',
    textAlign: 'center'
  },
  chartImage: {
    width: '90%',
    height: 180,
    marginBottom: 20,
    objectFit: 'contain'
  },
});

interface DashboardPDFProps {
  data: DashboardData;
}

const DashboardPDF: React.FC<DashboardPDFProps> = ({ data }) => {
  const [chartImages, setChartImages] = useState<{ [key: string]: string }>({});
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Prepare chart data with modern colors
  const genderChartData = {
    labels: ['Male', 'Female', 'Other'],
    datasets: [{
      data: [
        data.gender.male.ytd,
        data.gender.female.ytd,
        data.gender.other.ytd
      ],
      backgroundColor: ['#4CAF50', '#2196F3', '#FFC107'],
      borderWidth: 0,
      hoverOffset: 4
    }]
  };

  const divisionChartData = {
    labels: Object.keys(data.division),
    datasets: [{
      label: 'Utilization by Division',
      data: Object.values(data.division).map(d => d.ytd),
      backgroundColor: '#1a237e',
      borderWidth: 0,
      borderRadius: 4,
      barThickness: 20
    }]
  };

  const presentingIssuesData = {
    labels: Object.keys(data.presentingIssues),
    datasets: [{
      label: 'Presenting Issues',
      data: Object.values(data.presentingIssues).map(i => i.ytd),
      backgroundColor: '#4CAF50',
      borderWidth: 0,
      borderRadius: 4,
      barThickness: 20
    }]
  };

  useEffect(() => {
    const captureCharts = async () => {
      const charts = document.querySelectorAll('.chart-container');
      const chartImages: string[] = [];

      for (const chart of Array.from(charts)) {
        // Set willReadFrequently on all canvas elements
        const canvasElements = chart.querySelectorAll('canvas');
        Array.from(canvasElements).forEach((canvas: HTMLCanvasElement) => {
          canvas.setAttribute('willReadFrequently', 'true');
        });

        const canvas = await html2canvas(chart as HTMLElement, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          allowTaint: true,
          foreignObjectRendering: true
        });
        chartImages.push(canvas.toDataURL('image/png'));
      }

      return chartImages;
    };

    // Wait for the component to mount
    setTimeout(async () => {
      const images = await captureCharts();
      setChartImages(images.reduce((acc, image, index) => {
        acc[`chart${index + 1}`] = image;
        return acc;
      }, {} as { [key: string]: string }));
    }, 500);
  }, []);

  return (
    <>
      <div ref={chartContainerRef} style={{ display: 'none' }} />

      <Document>
        <Page size="A4" style={styles.page}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>UTMB EAP Utilization Report</Text>
            <Text style={styles.subtitle}>Employee Assistance Program Analytics</Text>
            <Text style={styles.reportPeriod}>Report Generated: {currentDate}</Text>
          </View>

          {/* Summary Statistics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Program Utilization Summary</Text>
            <View style={styles.summaryBox}>
              <View style={styles.summaryRow}>
                <View style={styles.col2}>
                  <Text style={styles.label}>Total Employees Covered:</Text>
                </View>
                <View style={styles.col}>
                  <Text style={styles.value}>{data.employeesCovered}</Text>
                </View>
              </View>
              <View style={styles.summaryRow}>
                <View style={styles.col2}>
                  <Text style={styles.label}>Total Lives Covered:</Text>
                </View>
                <View style={styles.col}>
                  <Text style={styles.value}>{data.livesCovered}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Cases by Type */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Case Distribution</Text>
            <View style={styles.headerRow}>
              <View style={styles.col2}>
                <Text>Case Type</Text>
              </View>
              <View style={styles.col}>
                <Text>Period to Date</Text>
              </View>
              <View style={styles.col}>
                <Text>Year to Date</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col2}>
                <Text style={styles.label}>EAP Cases</Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.value}>{data.casesByType.eap.pd}</Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.value}>{data.casesByType.eap.ytd}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col2}>
                <Text style={styles.label}>Work/Life Cases</Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.value}>{data.casesByType.wl.pd}</Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.value}>{data.casesByType.wl.ytd}</Text>
              </View>
            </View>
          </View>

          {/* Gender Distribution with Chart */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Demographics - Gender Distribution</Text>
            {chartImages.gender && (
              <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>Gender Distribution (Year to Date)</Text>
                <Image src={chartImages.gender} style={styles.chartImage} />
              </View>
            )}
            <View style={styles.headerRow}>
              <View style={styles.col2}>
                <Text>Gender</Text>
              </View>
              <View style={styles.col}>
                <Text>PD</Text>
              </View>
              <View style={styles.col}>
                <Text>PTD %</Text>
              </View>
              <View style={styles.col}>
                <Text>YTD</Text>
              </View>
            </View>
            {Object.entries(data.gender).map(([gender, stats]) => (
              <View key={gender} style={styles.row}>
                <View style={styles.col2}>
                  <Text style={styles.label}>{gender.charAt(0).toUpperCase() + gender.slice(1)}</Text>
                </View>
                <View style={styles.col}>
                  <Text style={styles.value}>{stats.pd}</Text>
                </View>
                <View style={styles.col}>
                  <Text style={styles.value}>{stats.ptd}%</Text>
                </View>
                <View style={styles.col}>
                  <Text style={styles.value}>{stats.ytd}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Division Distribution with Chart */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Utilization by Division</Text>
            {chartImages.division && (
              <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>Division Utilization (Year to Date)</Text>
                <Image src={chartImages.division} style={styles.chartImage} />
              </View>
            )}
            <View style={styles.headerRow}>
              <View style={styles.col3}>
                <Text>Division</Text>
              </View>
              <View style={styles.col}>
                <Text>PD</Text>
              </View>
              <View style={styles.col}>
                <Text>YTD %</Text>
              </View>
            </View>
            {Object.entries(data.division).map(([division, stats]) => (
              <View key={division} style={styles.row}>
                <View style={styles.col3}>
                  <Text style={styles.label}>{division}</Text>
                </View>
                <View style={styles.col}>
                  <Text style={styles.value}>{stats.pd}</Text>
                </View>
                <View style={styles.col}>
                  <Text style={styles.value}>{stats.ytdPercent}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Presenting Issues with Chart */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Presenting Issues</Text>
            {chartImages.presentingIssues && (
              <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>Top Presenting Issues (Year to Date)</Text>
                <Image src={chartImages.presentingIssues} style={styles.chartImage} />
              </View>
            )}
            <View style={styles.headerRow}>
              <View style={styles.col2}>
                <Text>Issue Type</Text>
              </View>
              <View style={styles.col}>
                <Text>PD</Text>
              </View>
              <View style={styles.col}>
                <Text>PTD %</Text>
              </View>
              <View style={styles.col}>
                <Text>YTD</Text>
              </View>
            </View>
            {Object.entries(data.presentingIssues).map(([issue, stats]) => (
              <View key={issue} style={styles.row}>
                <View style={styles.col2}>
                  <Text style={styles.label}>{issue}</Text>
                </View>
                <View style={styles.col}>
                  <Text style={styles.value}>{stats.pd}</Text>
                </View>
                <View style={styles.col}>
                  <Text style={styles.value}>{stats.ptd}%</Text>
                </View>
                <View style={styles.col}>
                  <Text style={styles.value}>{stats.ytd}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Footer */}
          <Text style={styles.footer}>
            UTMB Employee Assistance Program - Confidential Report
          </Text>
        </Page>
      </Document>
    </>
  );
};

export default DashboardPDF; 