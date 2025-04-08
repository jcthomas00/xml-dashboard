import { parseString } from 'xml2js';

export interface DashboardData {
  totalClients: number;
  totalCases: number;
  caseTypes: {
    eap: { pd: number; ytd: number };
    worklife: { pd: number; ytd: number };
  };
  utilizationRate: {
    current: number;
    yearly: number;
    description: string;
  };
  gender: Record<string, { yd: number; ptd: string }>;
  division: Record<string, { yd: number; ptd: string }>;
  presentingIssues: Record<string, { yd: number; ptd: string }>;
  age: Record<string, { yd: number; ptd: string }>;
  referredBy: Record<string, { yd: number; ptd: string }>;
}

export const parseXMLData = (xmlString: string): Promise<DashboardData> => {
  return new Promise((resolve, reject) => {
    parseString(xmlString, (err, result) => {
      if (err) {
        console.error('Error parsing XML:', err);
        reject(err);
        return;
      }

      console.log('Raw parsed XML result:', JSON.stringify(result, null, 2));

      const report = result.Report;
      if (!report) {
        console.error('No Report element found in XML');
        reject(new Error('No Report element found in XML'));
        return;
      }

      console.log('Report element:', JSON.stringify(report, null, 2));

      const data: DashboardData = {
        totalClients: parseInt(report.$.Textbox19) || 0,
        totalCases: 0,
        caseTypes: {
          eap: { pd: 0, ytd: 0 },
          worklife: { pd: 0, ytd: 0 }
        },
        utilizationRate: {
          current: 0,
          yearly: 0,
          description: ''
        },
        gender: {},
        presentingIssues: {},
        division: {},
        age: {},
        referredBy: {}
      };

      // Parse utilization rate data
      if (report.UtilRate && report.UtilRate[0].Report) {
        const utilReport = report.UtilRate[0].Report[0];
        if (utilReport.$.txtImpactDesc2) {
          data.utilizationRate.description = utilReport.$.txtImpactDesc2;
        }
        if (utilReport.Tablix3 && utilReport.Tablix3[0].Details2_Collection) {
          const details = utilReport.Tablix3[0].Details2_Collection[0].Details2[0].$;
          data.utilizationRate.current = parseFloat(details.PTD2) || 0;
          data.utilizationRate.yearly = parseFloat(details.YTD2) || 0;
        }
      }

      // Parse case type data
      if (report.GetCasesByType && report.GetCasesByType[0].Details12_Collection) {
        report.GetCasesByType[0].Details12_Collection[0].Details12.forEach((detail: any) => {
          const type = detail.$.OptionsKey2;
          if (type === 'EAP') {
            data.caseTypes.eap = {
              pd: parseInt(detail.$.PD2) || 0,
              ytd: parseInt(detail.$.YTD2) || 0
            };
          } else if (type === 'W/L') {
            data.caseTypes.worklife = {
              pd: parseInt(detail.$.PD2) || 0,
              ytd: parseInt(detail.$.YTD2) || 0
            };
          }
        });
        data.totalCases = data.caseTypes.eap.ytd + data.caseTypes.worklife.ytd;
      }

      console.log('Initial data structure:', JSON.stringify(data, null, 2));

      // Parse presenting issues
      if (report.PresentingIssuePrimary && report.PresentingIssuePrimary[0].Report) {
        report.PresentingIssuePrimary[0].Report[0].Tablix1[0].MainCategory_Collection[0].MainCategory.forEach((category: any) => {
          const categoryName = category.Optionskey3[0].$.Optionskey3;
          category.Textbox14[0].Issue_Collection[0].Issue.forEach((issue: any) => {
            const issueName = issue.$.Optionskey4;
            data.presentingIssues[`${categoryName} - ${issueName}`] = {
              yd: parseInt(issue.Details1_Collection[0].Details1[0].$.YD_5) || 0,
              ptd: issue.Details1_Collection[0].Details1[0].$.PTD_4 || '0'
            };
          });
        });
      }

      // Parse division data
      if (report.Division && report.Division[0].Report) {
        report.Division[0].Report[0].table1[0].Detail_Collection[0].Detail.forEach((detail: any) => {
          const divisionName = detail.$.DivisionName;
          data.division[divisionName] = {
            yd: parseInt(detail.$.PD_) || 0,
            ptd: detail.$.PTD_ || '0'
          };
        });
      }

      // Parse age data
      if (report.CS_Age3 && report.CS_Age3[0].Report && report.CS_Age3[0].Report[0].table1) {
        const table1 = report.CS_Age3[0].Report[0].table1[0];
        if (table1.table1_Optionskey_Collection && table1.table1_Optionskey_Collection[0].table1_Optionskey) {
          table1.table1_Optionskey_Collection[0].table1_Optionskey.forEach((optionKey: any) => {
            if (optionKey.Detail_Collection && optionKey.Detail_Collection[0].Detail) {
              const detail = optionKey.Detail_Collection[0].Detail[0];
              const ageGroup = detail.$.Optionskey;
              data.age[ageGroup] = {
                yd: parseInt(detail.$.PD_) || 0,
                ptd: detail.$.PTD_ || '0'
              };
            }
          });
        }
      }

      // Parse gender data
      if (report.CS_Gender && report.CS_Gender[0].Report) {
        report.CS_Gender[0].Report[0].table1[0].table1_Optionskey_Collection[0].table1_Optionskey.forEach((optionKey: any) => {
          if (optionKey.Detail_Collection && optionKey.Detail_Collection[0].Detail) {
            const detail = optionKey.Detail_Collection[0].Detail[0];
            const rawGender = detail.$.Optionskey;
            // Skip "Data Not Available" entries
            if (rawGender.toLowerCase() !== 'data not available') {
              const gender = rawGender.toLowerCase() as 'male' | 'female' | 'other';
              data.gender[gender] = {
                yd: parseInt(detail.$.PD_) || 0,
                ptd: detail.$.PTD_ || '0'
              };
            }
          }
        });
      }

      // Parse referredBy data
      if (report.referredby && report.referredby[0].Report) {
        const table1 = report.referredby[0].Report[0].table1[0];
        if (table1.table1_Optionskey_Collection && table1.table1_Optionskey_Collection[0].table1_Optionskey) {
          table1.table1_Optionskey_Collection[0].table1_Optionskey.forEach((optionKey: any) => {
            if (optionKey.Detail_Collection && optionKey.Detail_Collection[0].Detail) {
              const detail = optionKey.Detail_Collection[0].Detail[0];
              const category = detail.$.Optionskey;
              // Skip "Data Not Available" entries
              if (category.toLowerCase() !== 'data not available') {
                data.referredBy[category] = {
                  yd: parseInt(detail.$.PD_) || 0,
                  ptd: detail.$.PTD_ || '0%'
                };
              }
            }
          });
        }
      }

      console.log('Final parsed data:', JSON.stringify(data, null, 2));
      resolve(data);
    });
  });
}; 