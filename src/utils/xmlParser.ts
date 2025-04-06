import { parseString } from 'xml2js';

export interface DashboardData {
  employeesCovered: number;
  livesCovered: number;
  casesByType: {
    eap: {
      pd: number;
      ytd: number;
    };
    wl: {
      pd: number;
      ytd: number;
    };
  };
  gender: {
    male: {
      pd: number;
      ptd: string;
      yd: number;
      ytd: string;
    };
    female: {
      pd: number;
      ptd: string;
      yd: number;
      ytd: string;
    };
    other: {
      pd: number;
      ptd: string;
      yd: number;
      ytd: string;
    };
  };
  presentingIssues: {
    [key: string]: {
      pd: number;
      ptd: string;
      yd: number;
      ytd: string;
    };
  };
  division: {
    [key: string]: {
      pd: number;
      ptd: string;
      ytd: number;
      ytdPercent: string;
    };
  };
  age: {
    [key: string]: {
      pd: number;
      ptd: string;
      yd: number;
      ytd: string;
    };
  };
  referralSource: {
    [key: string]: {
      pd: number;
      ptd: string;
      yd: number;
      ytd: string;
    };
  };
}

export const parseXMLData = (xmlString: string): Promise<DashboardData> => {
  return new Promise((resolve, reject) => {
    parseString(xmlString, (err, result) => {
      if (err) {
        reject(err);
        return;
      }

      const report = result.Report;
      const data: DashboardData = {
        employeesCovered: parseInt(report.$.Textbox19),
        livesCovered: parseInt(report.$.Textbox30),
        casesByType: {
          eap: {
            pd: parseInt(report.GetCasesByType[0].Details12_Collection[0].Details12[0].$.PD2),
            ytd: parseInt(report.GetCasesByType[0].Details12_Collection[0].Details12[0].$.YTD2)
          },
          wl: {
            pd: parseInt(report.GetCasesByType[0].Details12_Collection[0].Details12[1].$.PD2),
            ytd: parseInt(report.GetCasesByType[0].Details12_Collection[0].Details12[1].$.YTD2)
          }
        },
        gender: {
          male: {
            pd: parseInt(report.CS_Gender[0].Report[0].table1[0].table1_Optionskey_Collection[0].table1_Optionskey[0].Detail_Collection[0].Detail[0].$.PD_),
            ptd: report.CS_Gender[0].Report[0].table1[0].table1_Optionskey_Collection[0].table1_Optionskey[0].Detail_Collection[0].Detail[0].$.PTD_,
            yd: parseInt(report.CS_Gender[0].Report[0].table1[0].table1_Optionskey_Collection[0].table1_Optionskey[0].Detail_Collection[0].Detail[0].$.YD_),
            ytd: report.CS_Gender[0].Report[0].table1[0].table1_Optionskey_Collection[0].table1_Optionskey[0].Detail_Collection[0].Detail[0].$.YTD_
          },
          female: {
            pd: parseInt(report.CS_Gender[0].Report[0].table1[0].table1_Optionskey_Collection[0].table1_Optionskey[1].Detail_Collection[0].Detail[0].$.PD_),
            ptd: report.CS_Gender[0].Report[0].table1[0].table1_Optionskey_Collection[0].table1_Optionskey[1].Detail_Collection[0].Detail[0].$.PTD_,
            yd: parseInt(report.CS_Gender[0].Report[0].table1[0].table1_Optionskey_Collection[0].table1_Optionskey[1].Detail_Collection[0].Detail[0].$.YD_),
            ytd: report.CS_Gender[0].Report[0].table1[0].table1_Optionskey_Collection[0].table1_Optionskey[1].Detail_Collection[0].Detail[0].$.YTD_
          },
          other: {
            pd: parseInt(report.CS_Gender[0].Report[0].table1[0].table1_Optionskey_Collection[0].table1_Optionskey[2].Detail_Collection[0].Detail[0].$.PD_),
            ptd: report.CS_Gender[0].Report[0].table1[0].table1_Optionskey_Collection[0].table1_Optionskey[2].Detail_Collection[0].Detail[0].$.PTD_,
            yd: parseInt(report.CS_Gender[0].Report[0].table1[0].table1_Optionskey_Collection[0].table1_Optionskey[2].Detail_Collection[0].Detail[0].$.YD_),
            ytd: report.CS_Gender[0].Report[0].table1[0].table1_Optionskey_Collection[0].table1_Optionskey[2].Detail_Collection[0].Detail[0].$.YTD_
          }
        },
        presentingIssues: {},
        division: {},
        age: {},
        referralSource: {}
      };

      // Parse presenting issues
      report.PresentingIssuePrimary[0].Report[0].Tablix1[0].MainCategory_Collection[0].MainCategory.forEach((category: any) => {
        const categoryName = category.Optionskey3[0].$.Optionskey3;
        category.Textbox14[0].Issue_Collection[0].Issue.forEach((issue: any) => {
          const issueName = issue.$.Optionskey4;
          data.presentingIssues[`${categoryName} - ${issueName}`] = {
            pd: parseInt(issue.Details1_Collection[0].Details1[0].$.YD_5),
            ptd: issue.Details1_Collection[0].Details1[0].$.PTD_7,
            yd: parseInt(issue.Details1_Collection[0].Details1[0].$.YD_2),
            ytd: issue.Details1_Collection[0].Details1[0].$.PTD_4
          };
        });
      });

      // Parse division data
      report.Division[0].Report[0].table1[0].Detail_Collection[0].Detail.forEach((detail: any) => {
        const divisionName = detail.$.DivisionName;
        data.division[divisionName] = {
          pd: parseInt(detail.$.PD_),
          ptd: detail.$.PTD_,
          ytd: parseInt(detail.$.YTD_),
          ytdPercent: detail.$.YTD
        };
      });

      // Parse age data
      console.log('Attempting to parse age data...');
      if (report.CS_Age3) {
        console.log('CS_Age3 found:', JSON.stringify(report.CS_Age3, null, 2));
        
        if (report.CS_Age3[0].Report) {
          console.log('Report found in CS_Age3:', JSON.stringify(report.CS_Age3[0].Report, null, 2));
          
          if (report.CS_Age3[0].Report[0].table1) {
            console.log('Table1 found:', JSON.stringify(report.CS_Age3[0].Report[0].table1, null, 2));
            const table1 = report.CS_Age3[0].Report[0].table1[0];
            
            // Check for the correct structure with table1_Optionskey_Collection
            if (table1.table1_Optionskey_Collection && table1.table1_Optionskey_Collection[0].table1_Optionskey) {
              console.log('Using table1_Optionskey_Collection structure');
              table1.table1_Optionskey_Collection[0].table1_Optionskey.forEach((optionKey: any) => {
                if (optionKey.Detail_Collection && optionKey.Detail_Collection[0].Detail) {
                  const detail = optionKey.Detail_Collection[0].Detail[0];
                  const ageGroup = detail.$.Optionskey;
                  console.log('Processing age group:', ageGroup, detail.$);
                  data.age[ageGroup] = {
                    pd: parseInt(detail.$.PD_),
                    ptd: detail.$.PTD_,
                    yd: parseInt(detail.$.YD_),
                    ytd: detail.$.YTD_
                  };
                }
              });
            } else {
              console.log('No valid age data structure found in table1:', table1);
            }
          } else {
            console.log('No table1 found in Report');
          }
        } else {
          console.log('No Report found in CS_Age3');
        }
      } else {
        console.log('No CS_Age3 found in report');
      }
      
      console.log('Final age data:', data.age);

      // Parse referral source data
      console.log('Attempting to parse referral source data...');
      if (report.referredby) {
        console.log('referredby found:', JSON.stringify(report.referredby, null, 2));
        
        if (report.referredby[0].Report) {
          console.log('Report found in referredby:', JSON.stringify(report.referredby[0].Report, null, 2));
          
          if (report.referredby[0].Report[0].table1) {
            console.log('Table1 found in Report:', JSON.stringify(report.referredby[0].Report[0].table1, null, 2));
            const table1 = report.referredby[0].Report[0].table1[0];
            
            // Check for different possible structures
            if (table1.Detail_Collection && table1.Detail_Collection[0].Detail) {
              console.log('Using Detail_Collection structure');
              table1.Detail_Collection[0].Detail.forEach((detail: any) => {
                const source = detail.$.Optionskey;
                console.log('Processing referral source:', source, detail.$);
                data.referralSource[source] = {
                  pd: parseInt(detail.$.PD_),
                  ptd: detail.$.PTD_,
                  yd: parseInt(detail.$.YD_),
                  ytd: detail.$.YTD_
                };
              });
            } else if (table1.Detail) {
              console.log('Using Detail structure');
              table1.Detail.forEach((detail: any) => {
                const source = detail.$.Optionskey;
                console.log('Processing referral source:', source, detail.$);
                data.referralSource[source] = {
                  pd: parseInt(detail.$.PD_),
                  ptd: detail.$.PTD_,
                  yd: parseInt(detail.$.YD_),
                  ytd: detail.$.YTD_
                };
              });
            } else if (table1.Details) {
              console.log('Using Details structure');
              table1.Details.forEach((detail: any) => {
                const source = detail.$.Optionskey;
                console.log('Processing referral source:', source, detail.$);
                data.referralSource[source] = {
                  pd: parseInt(detail.$.PD_),
                  ptd: detail.$.PTD_,
                  yd: parseInt(detail.$.YD_),
                  ytd: detail.$.YTD_
                };
              });
            } else if (table1.table1_Optionskey_Collection && table1.table1_Optionskey_Collection[0].table1_Optionskey) {
              console.log('Using table1_Optionskey_Collection structure');
              table1.table1_Optionskey_Collection[0].table1_Optionskey.forEach((optionKey: any) => {
                if (optionKey.Detail_Collection && optionKey.Detail_Collection[0].Detail) {
                  const detail = optionKey.Detail_Collection[0].Detail[0];
                  const source = detail.$.Optionskey;
                  console.log('Processing referral source:', source, detail.$);
                  data.referralSource[source] = {
                    pd: parseInt(detail.$.PD_),
                    ptd: detail.$.PTD_,
                    yd: parseInt(detail.$.YD_),
                    ytd: detail.$.YTD_
                  };
                }
              });
            } else {
              console.log('No valid referral source data structure found in table1:', table1);
            }
          } else {
            console.log('No table1 found in Report');
          }
        } else {
          console.log('No Report found in referredby');
        }
      } else {
        console.log('No referredby found in report');
      }
      
      console.log('Final referral source data:', data.referralSource);

      resolve(data);
    });
  });
}; 