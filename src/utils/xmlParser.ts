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
  workStatus: Record<string, { yd: number; ptd: string }>;
  education?: {
    label: string;
    pd: number;
    ptd: string;
    yd: number;
    ytd: string;
  }[];
  Urgency?: {
    Report: {
      Tablix3: {
        Details_Collection: {
          Details: {
            Optionskey1: string;
            PD_1: string;
            Textbox24: string;
            Textbox28: string;
            Textbox44: string;
          }[];
        };
      };
    };
  };
  awareEAP?: Record<string, { yd: number; ptd: string }>;
  priorEAP?: Record<string, { yd: number; ptd: string; ytd: string }>;
  maritalStatus?: Record<string, { yd: number; ptd: string; ytd: string }>;
  ethnicity?: Record<string, { yd: number; ptd: string; ytd: string }>;
  casesClosed?: {
    eap: { pd: number; ptd: string; yd: number; ytd: string };
    worklife: { pd: number; ptd: string; yd: number; ytd: string };
  };
}

export const parseXMLData = (xmlString: string): Promise<DashboardData> => {
  return new Promise((resolve, reject) => {
    parseString(xmlString, { 
      explicitArray: false, 
      mergeAttrs: true,
      ignoreAttrs: false,
      attrNameProcessors: [(name) => name.replace(/^@/, '')]
    }, (err, result) => {
      if (err) {
        console.error('Error parsing XML:', err);
        reject(new Error('Error parsing XML file. Please ensure it matches the required format.'));
        return;
      }

      if (!result || !result.Report) {
        console.error('Invalid XML structure:', result);
        reject(new Error('Invalid XML structure. No Report element found.'));
        return;
      }

      const report = result.Report;

      try {
        const data: DashboardData = {
          totalClients: parseInt(report.Textbox19) || 0,
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
          referredBy: {},
          workStatus: {},
          priorEAP: {},
          maritalStatus: {},
          ethnicity: {},
          casesClosed: {
            eap: { pd: 0, ptd: '0%', yd: 0, ytd: '0%' },
            worklife: { pd: 0, ptd: '0%', yd: 0, ytd: '0%' }
          }
        };

        // Parse utilization rate data
        if (report.UtilRate?.Report) {
          const utilReport = report.UtilRate.Report;
          if (utilReport.txtImpactDesc2) {
            data.utilizationRate.description = utilReport.txtImpactDesc2;
          }
          if (utilReport.Tablix3?.Details2_Collection?.Details2) {
            const details = utilReport.Tablix3.Details2_Collection.Details2;
            data.utilizationRate.current = parseFloat(details.PTD2) || 0;
            data.utilizationRate.yearly = parseFloat(details.YTD2) || 0;
          }
        }

        // Parse case type data
        if (report.GetCasesByType?.Details12_Collection?.Details12) {
          const details = Array.isArray(report.GetCasesByType.Details12_Collection.Details12) 
            ? report.GetCasesByType.Details12_Collection.Details12 
            : [report.GetCasesByType.Details12_Collection.Details12];

          details.forEach((detail: any) => {
            const type = detail.OptionsKey2;
            if (type === 'EAP') {
              data.caseTypes.eap = {
                pd: parseInt(detail.PD2) || 0,
                ytd: parseInt(detail.PD2) || 0
              };
            } else if (type === 'W/L') {
              data.caseTypes.worklife = {
                pd: parseInt(detail.PD2) || 0,
                ytd: parseInt(detail.PD2) || 0
              };
            }
          });
          data.totalCases = data.caseTypes.eap.ytd + data.caseTypes.worklife.ytd;
        }

        // Parse presenting issues
        if (report.PresentingIssuePrimary?.Report?.Tablix1?.MainCategory_Collection?.MainCategory) {
          const categories = Array.isArray(report.PresentingIssuePrimary.Report.Tablix1.MainCategory_Collection.MainCategory)
            ? report.PresentingIssuePrimary.Report.Tablix1.MainCategory_Collection.MainCategory
            : [report.PresentingIssuePrimary.Report.Tablix1.MainCategory_Collection.MainCategory];

          categories.forEach((category: any) => {
            const categoryName = category.Optionskey3.Optionskey3;
            const issues = Array.isArray(category.Textbox14.Issue_Collection.Issue)
              ? category.Textbox14.Issue_Collection.Issue
              : [category.Textbox14.Issue_Collection.Issue];

            issues.forEach((issue: any) => {
              const issueName = issue.Optionskey4;
              data.presentingIssues[`${categoryName} - ${issueName}`] = {
                yd: parseInt(issue.Details1_Collection.Details1.YD_5) || 0,
                ptd: issue.Details1_Collection.Details1.PTD_4 || '0'
              };
            });
          });
        }

        // Parse division data
        if (report.Division?.Report?.table1?.Detail_Collection?.Detail) {
          const details = Array.isArray(report.Division.Report.table1.Detail_Collection.Detail)
            ? report.Division.Report.table1.Detail_Collection.Detail
            : [report.Division.Report.table1.Detail_Collection.Detail];

          details.forEach((detail: any) => {
            const divisionName = detail.DivisionName;
            data.division[divisionName] = {
              yd: parseInt(detail.PD_) || 0,
              ptd: detail.PTD_ || '0'
            };
          });
        }

        // Parse age data
        if (report.CS_Age3?.Report?.table1?.table1_Optionskey_Collection?.table1_Optionskey) {
          const options = Array.isArray(report.CS_Age3.Report.table1.table1_Optionskey_Collection.table1_Optionskey)
            ? report.CS_Age3.Report.table1.table1_Optionskey_Collection.table1_Optionskey
            : [report.CS_Age3.Report.table1.table1_Optionskey_Collection.table1_Optionskey];

          options.forEach((optionKey: any) => {
            if (optionKey.Detail_Collection?.Detail) {
              const detail = Array.isArray(optionKey.Detail_Collection.Detail)
                ? optionKey.Detail_Collection.Detail[0]
                : optionKey.Detail_Collection.Detail;
              const ageGroup = detail.Optionskey;
              data.age[ageGroup] = {
                yd: parseInt(detail.PD_) || 0,
                ptd: detail.PTD_ || '0'
              };
            }
          });
        }

        // Parse gender data
        if (report.CS_Gender?.Report?.table1?.table1_Optionskey_Collection?.table1_Optionskey) {
          const options = Array.isArray(report.CS_Gender.Report.table1.table1_Optionskey_Collection.table1_Optionskey)
            ? report.CS_Gender.Report.table1.table1_Optionskey_Collection.table1_Optionskey
            : [report.CS_Gender.Report.table1.table1_Optionskey_Collection.table1_Optionskey];

          options.forEach((optionKey: any) => {
            if (optionKey.Detail_Collection?.Detail) {
              const detail = Array.isArray(optionKey.Detail_Collection.Detail)
                ? optionKey.Detail_Collection.Detail[0]
                : optionKey.Detail_Collection.Detail;
              const rawGender = detail.Optionskey;
              if (rawGender.toLowerCase() !== 'data not available') {
                const gender = rawGender.toLowerCase() as 'male' | 'female' | 'other';
                data.gender[gender] = {
                  yd: parseInt(detail.PD_) || 0,
                  ptd: detail.PTD_ || '0'
                };
              }
            }
          });
        }

        // Parse referredBy data
        if (report.referredby?.Report?.table1?.table1_Optionskey_Collection?.table1_Optionskey) {
          const options = Array.isArray(report.referredby.Report.table1.table1_Optionskey_Collection.table1_Optionskey)
            ? report.referredby.Report.table1.table1_Optionskey_Collection.table1_Optionskey
            : [report.referredby.Report.table1.table1_Optionskey_Collection.table1_Optionskey];

          const referredByData = options.reduce((acc: any, item: any) => {
            if (item.Detail_Collection?.Detail) {
              const detail = Array.isArray(item.Detail_Collection.Detail)
                ? item.Detail_Collection.Detail[0]
                : item.Detail_Collection.Detail;
              if (detail.Optionskey !== "Data Not Available") {
                acc[detail.Optionskey] = {
                  yd: parseInt(detail.PD_) || 0,
                  ptd: detail.PTD_ || '0'
                };
              }
            }
            return acc;
          }, {});
          data.referredBy = referredByData;
        }

        // Parse workStatus data
        if (report.WorkStatus?.Report?.table1?.table1_Optionskey_Collection?.table1_Optionskey) {
          const options = Array.isArray(report.WorkStatus.Report.table1.table1_Optionskey_Collection.table1_Optionskey)
            ? report.WorkStatus.Report.table1.table1_Optionskey_Collection.table1_Optionskey
            : [report.WorkStatus.Report.table1.table1_Optionskey_Collection.table1_Optionskey];

          const workStatusData = options.reduce((acc: any, item: any) => {
            if (item.Detail_Collection?.Detail) {
              const detail = Array.isArray(item.Detail_Collection.Detail)
                ? item.Detail_Collection.Detail[0]
                : item.Detail_Collection.Detail;
              if (detail.Optionskey !== "Data Not Available") {
                acc[detail.Optionskey] = {
                  yd: parseInt(detail.PD_) || 0,
                  ptd: detail.PTD_ || '0'
                };
              }
            }
            return acc;
          }, {});
          data.workStatus = workStatusData;
        }

        // Parse education data
        if (report.Education?.Report?.table1?.table1_Optionskey_Collection?.table1_Optionskey) {
          const educationData = Array.isArray(report.Education.Report.table1.table1_Optionskey_Collection.table1_Optionskey)
            ? report.Education.Report.table1.table1_Optionskey_Collection.table1_Optionskey
            : [report.Education.Report.table1.table1_Optionskey_Collection.table1_Optionskey];

          data.education = educationData.reduce((acc: any[], item: any) => {
            if (item.Detail_Collection?.Detail) {
              const detail = item.Detail_Collection.Detail;
              acc.push({
                label: detail.Textbox13 || '',
                pd: parseInt(detail.Textbox14 || '0', 10),
                ptd: detail.Textbox15 || '0%',
                yd: parseInt(detail.Textbox14 || '0', 10),
                ytd: detail.Textbox18 || '0%'
              });
            }
            return acc;
          }, []);
        }

        // Parse Urgency data
        if (report.Urgency?.Report?.Tablix3?.Details_Collection?.Details) {
          const details = Array.isArray(report.Urgency.Report.Tablix3.Details_Collection.Details)
            ? report.Urgency.Report.Tablix3.Details_Collection.Details
            : [report.Urgency.Report.Tablix3.Details_Collection.Details];

          data.Urgency = {
            Report: {
              Tablix3: {
                Details_Collection: {
                  Details: details.map((detail: any) => ({
                    Optionskey1: detail.Optionskey1,
                    PD_1: detail.PD_1,
                    Textbox24: detail.Textbox24,
                    Textbox28: detail.Textbox28,
                    Textbox44: detail.Textbox44
                  }))
                }
              }
            }
          };
        }

        // Parse AwareEAP data
        if (report.AwareEAP?.Report?.table1?.table1_Optionskey_Collection?.table1_Optionskey) {
          const options = Array.isArray(report.AwareEAP.Report.table1.table1_Optionskey_Collection.table1_Optionskey)
            ? report.AwareEAP.Report.table1.table1_Optionskey_Collection.table1_Optionskey
            : [report.AwareEAP.Report.table1.table1_Optionskey_Collection.table1_Optionskey];

          const awareEAPData = options.reduce((acc: any, item: any) => {
            if (item.Detail_Collection?.Detail) {
              const detail = Array.isArray(item.Detail_Collection.Detail)
                ? item.Detail_Collection.Detail[0]
                : item.Detail_Collection.Detail;
              if (detail.Optionskey !== "Data Not Available") {
                acc[detail.Optionskey] = {
                  yd: parseInt(detail.PD_) || 0,
                  ptd: detail.PTD_ || '0'
                };
              }
            }
            return acc;
          }, {});
          data.awareEAP = awareEAPData;
        }

        // Parse PriorEAP data
        if (report.PriorEAP?.Report?.table1?.table1_Optionskey_Collection?.table1_Optionskey) {
          const options = Array.isArray(report.PriorEAP.Report.table1.table1_Optionskey_Collection.table1_Optionskey)
            ? report.PriorEAP.Report.table1.table1_Optionskey_Collection.table1_Optionskey
            : [report.PriorEAP.Report.table1.table1_Optionskey_Collection.table1_Optionskey];

          const priorEAPData = options.reduce((acc: any, item: any) => {
            if (item.Detail_Collection?.Detail) {
              const detail = Array.isArray(item.Detail_Collection.Detail)
                ? item.Detail_Collection.Detail[0]
                : item.Detail_Collection.Detail;
              if (detail.Optionskey !== "Data Not Available") {
                acc[detail.Optionskey] = {
                  yd: parseInt(detail.PD_) || 0,
                  ptd: detail.PTD_2 || '0%',
                  ytd: detail.YTD_ || '0%'
                };
              }
            }
            return acc;
          }, {});
          data.priorEAP = priorEAPData;
        }

        // Parse MaritalStatus data
        if (report.MaritalStatus?.Report?.table1?.table1_Optionskey_Collection?.table1_Optionskey) {
          const options = Array.isArray(report.MaritalStatus.Report.table1.table1_Optionskey_Collection.table1_Optionskey)
            ? report.MaritalStatus.Report.table1.table1_Optionskey_Collection.table1_Optionskey
            : [report.MaritalStatus.Report.table1.table1_Optionskey_Collection.table1_Optionskey];

          const maritalStatusData = options.reduce((acc: any, item: any) => {
            if (item.Detail_Collection?.Detail) {
              const detail = Array.isArray(item.Detail_Collection.Detail)
                ? item.Detail_Collection.Detail[0]
                : item.Detail_Collection.Detail;
              if (detail.Optionskey !== "Data Not Available") {
                acc[detail.Optionskey] = {
                  yd: parseInt(detail.PD_) || 0,
                  ptd: detail.PTD_ || '0%',
                  ytd: detail.YTD_ || '0%'
                };
              }
            }
            return acc;
          }, {});
          data.maritalStatus = maritalStatusData;
        }

        // Parse ethnicity data
        if (report.Ethnicity?.Report?.table1?.table1_Optionskey_Collection?.table1_Optionskey) {
          const options = Array.isArray(report.Ethnicity.Report.table1.table1_Optionskey_Collection.table1_Optionskey)
            ? report.Ethnicity.Report.table1.table1_Optionskey_Collection.table1_Optionskey
            : [report.Ethnicity.Report.table1.table1_Optionskey_Collection.table1_Optionskey];

          const ethnicityData = options.reduce((acc: any, item: any) => {
            if (item.Detail_Collection?.Detail) {
              const detail = Array.isArray(item.Detail_Collection.Detail)
                ? item.Detail_Collection.Detail[0]
                : item.Detail_Collection.Detail;
              if (detail.Optionskey !== "Data Not Available") {
                acc[detail.Optionskey] = {
                  yd: parseInt(detail.PD_) || 0,
                  ptd: detail.PTD_ || '0%',
                  ytd: detail.YTD_ || '0%'
                };
              }
            }
            return acc;
          }, {});
          data.ethnicity = ethnicityData;
        }

        // Parse cases closed data
        if (report.CasesClosed?.Report?.table1?.table1_Optionskey_Collection?.table1_Optionskey) {
          const options = Array.isArray(report.CasesClosed.Report.table1.table1_Optionskey_Collection.table1_Optionskey)
            ? report.CasesClosed.Report.table1.table1_Optionskey_Collection.table1_Optionskey
            : [report.CasesClosed.Report.table1.table1_Optionskey_Collection.table1_Optionskey];

          options.forEach((option: any) => {
            if (option.Detail_Collection?.Detail) {
              const detail = Array.isArray(option.Detail_Collection.Detail)
                ? option.Detail_Collection.Detail[0]
                : option.Detail_Collection.Detail;
              if (detail.Optionskey === 'EAP' && data.casesClosed) {
                data.casesClosed.eap = {
                  pd: parseInt(detail.PD_) || 0,
                  ptd: detail.PTD_ || '0%',
                  yd: parseInt(detail.YD_) || 0,
                  ytd: detail.YTD_ || '0%'
                };
              } else if (detail.Optionskey === 'W/L' && data.casesClosed) {
                data.casesClosed.worklife = {
                  pd: parseInt(detail.PD_) || 0,
                  ptd: detail.PTD_ || '0%',
                  yd: parseInt(detail.YD_) || 0,
                  ytd: detail.YTD_ || '0%'
                };
              }
            }
          });
        }

        resolve(data);
      } catch (error) {
        console.error('Error processing XML data:', error);
        reject(new Error('Error processing XML data. Please check the file format.'));
      }
    });
  });
}; 