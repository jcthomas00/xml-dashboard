import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { StatValue, DashboardData } from '../types/dashboard';

// Register fonts
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.ttf' },
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmEU9fBBc4.ttf', fontWeight: 'bold' }
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
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
  table: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    marginTop: 10
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
    borderBottomStyle: 'solid',
    paddingVertical: 5
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#333333',
    borderBottomStyle: 'solid',
    paddingVertical: 5,
    backgroundColor: '#f0f0f0'
  },
  tableCell: {
    flex: 1,
    padding: 5,
    fontSize: 10
  },
  tableHeaderCell: {
    flex: 1,
    padding: 5,
    fontSize: 10,
    fontWeight: 'bold'
  },
  statCard: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#dddddd',
    borderStyle: 'solid'
  },
  statTitle: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 5
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333'
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
  }
});

interface DashboardPDFProps {
  data: DashboardData;
}

const DashboardPDF: React.FC<DashboardPDFProps> = ({ data }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  if (!data) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.title}>EAP Dashboard Report</Text>
            <Text style={styles.subtitle}>No data available</Text>
          </View>
          <Text style={styles.footer}>
            UTMB Employee Assistance Program - Confidential Report
          </Text>
        </Page>
      </Document>
    );
  }

  const { gender, division, presentingIssues, age, totalClients, activeCases, closedCases } = data;

  const renderTableRow = (key: string, value: StatValue) => {
    return (
      <View key={key} style={styles.tableRow}>
        <Text style={styles.tableCell}>{key}</Text>
        <Text style={styles.tableCell}>{value.ptd}</Text>
        <Text style={styles.tableCell}>{value.ytd}</Text>
      </View>
    );
  };

  const renderSection = (title: string, data: Record<string, StatValue> | undefined | null, headerLabel: string) => {
    if (!data) return null;
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>EAP Dashboard Report</Text>
          <Text style={styles.subtitle}>Generated on {currentDate}</Text>
        </View>

        {/* Statistics Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <View style={[styles.statCard, { width: '48%', marginBottom: 10 }]}>
              <Text style={styles.statTitle}>Total Cases</Text>
              <Text style={styles.statValue}>{data?.totalCases || 0}</Text>
            </View>
            <View style={[styles.statCard, { width: '48%', marginBottom: 10 }]}>
              <Text style={styles.statTitle}>EAP Cases</Text>
              <Text style={styles.statValue}>{data?.caseTypes?.eap?.ytd || 0}</Text>
            </View>
            <View style={[styles.statCard, { width: '48%', marginBottom: 10 }]}>
              <Text style={styles.statTitle}>Worklife Cases</Text>
              <Text style={styles.statValue}>{data?.caseTypes?.worklife?.ytd || 0}</Text>
            </View>
            <View style={[styles.statCard, { width: '48%', marginBottom: 10 }]}>
              <Text style={styles.statTitle}>Utilization Rate</Text>
              <View style={{ marginTop: 5 }}>
                <Text style={[styles.statValue, { fontSize: 14 }]}>Current: {data?.utilizationRate?.current || 0}%</Text>
                <Text style={[styles.statValue, { fontSize: 14 }]}>Yearly: {data?.utilizationRate?.yearly || 0}%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Data Sections */}
        {renderSection('Gender Distribution', gender, 'Gender')}
        {renderSection('Division Distribution', division, 'Division')}
        {renderSection('Presenting Issues', presentingIssues, 'Issue')}
        {renderSection('Age Distribution', age, 'Age Range')}

        {/* Footer */}
        <Text style={styles.footer}>
          UTMB Employee Assistance Program - Confidential Report
        </Text>
      </Page>
    </Document>
  );
};

export default DashboardPDF; 