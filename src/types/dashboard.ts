export interface StatValue {
  ptd: number;
  ytd: number;
}

export interface ChartDataItem {
  label: string;
  value: number;
  percentage: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
}

export interface ChartVisibility {
  gender: boolean;
  division: boolean;
  age: boolean;
  presentingIssues: boolean;
  referredBy: boolean;
  workStatus: boolean;
  education: boolean;
}

export interface DashboardData {
  gender: Record<string, StatValue>;
  division: Record<string, StatValue>;
  presentingIssues: Record<string, StatValue>;
  age: Record<string, StatValue>;
  referredBy: Record<string, StatValue>;
  workStatus: Record<string, StatValue>;
  education: Record<string, StatValue>;
  totalCases: number;
  totalClients: number;
  activeCases: number;
  closedCases: number;
  caseTypes: {
    eap: { ytd: number };
    worklife: { ytd: number };
  };
  utilizationRate: {
    current: number;
    yearly: number;
  };
} 