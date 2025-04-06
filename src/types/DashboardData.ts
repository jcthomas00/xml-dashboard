export interface DashboardData {
  totalClients: number;
  activeCases: number;
  closedCases: number;
  gender: {
    male: { ytd: number; ptd: string };
    female: { ytd: number; ptd: string };
    other: { ytd: number; ptd: string };
  };
  division: {
    [key: string]: { ytd: number; ptd: string };
  };
  presentingIssues: {
    [key: string]: { ytd: number; ptd: string };
  };
  age: {
    [key: string]: { ytd: number; ptd: string };
  };
} 