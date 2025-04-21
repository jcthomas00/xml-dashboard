import React, { useEffect, useRef, useState } from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { ChartData, ChartVisibility } from '../types/dashboard';
import { toast } from 'react-hot-toast';

// Register the CategoryScale
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

interface DashboardData {
  totalClients: number;
  activeCases: number;
  closedCases: number;
  genderData: ChartData;
  divisionData: ChartData;
  ageData: ChartData;
  presentingIssuesData: ChartData;
  referredByData: ChartData;
  workStatusData: ChartData;
  educationData: ChartData;
  chartVisibility: ChartVisibility;
}

// ... rest of the component code ... 