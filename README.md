# UTMB EAP Dashboard

A React-based dashboard for visualizing Employee Assistance Program (EAP) data from UTMB. This application provides interactive visualizations of EAP statistics and metrics, with the ability to export reports as PDFs.

## Features

- Interactive charts and graphs displaying EAP statistics
- Key metrics visualization including:
  - Total employees covered
  - Total cases
  - Average cases per month
  - Gender distribution
  - Division distribution
  - Presenting issues
  - Age distribution
- PDF export functionality
- Responsive design for all screen sizes
- Custom CSS styling for modern UI

## Project Structure

```
uteap-dashboard/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx         # Main dashboard component
│   │   ├── ChartRenderer.tsx     # Chart rendering component
│   │   ├── DashboardPDF.tsx      # PDF generation component
│   │   └── PDFDownloadWrapper.tsx # PDF download wrapper
│   ├── styles/
│   │   └── Dashboard.css         # Custom styling
│   ├── types/
│   │   └── DashboardData.ts      # TypeScript interfaces
│   ├── utils/
│   │   └── xmlParser.ts          # XML parsing utilities
│   ├── App.tsx
│   └── index.tsx
├── package.json
├── tsconfig.json
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/jcthomas00/xml-dashboard.git
cd xml-dashboard
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

1. Start the development server:
```bash
npm start
```

2. Open your browser and navigate to `http://localhost:3000`

## Building for Production

To create a production build:

```bash
npm run build
```

The build output will be in the `build` directory.

## Components Overview

### Dashboard.tsx
The main component that:
- Fetches and processes XML data
- Renders statistics and charts
- Handles PDF generation
- Manages loading and error states

### ChartRenderer.tsx
Responsible for:
- Rendering different types of charts
- Handling chart configurations
- Managing chart interactions

### DashboardPDF.tsx
Handles:
- PDF document generation
- Layout and styling of PDF content
- Data formatting for PDF export

### PDFDownloadWrapper.tsx
Provides:
- PDF download functionality
- Loading state management
- Error handling for PDF generation

## Data Format

The application expects XML data in the following format:

```xml
<data>
  <statistics>
    <employeesCovered>1000</employeesCovered>
    <totalCases>500</totalCases>
    <averageCasesPerMonth>42</averageCasesPerMonth>
  </statistics>
  <genderDistribution>
    <male>300</male>
    <female>200</female>
  </genderDistribution>
  <divisionDistribution>
    <division name="Division A">150</division>
    <division name="Division B">100</division>
  </divisionDistribution>
  <presentingIssues>
    <issue name="Issue A">50</issue>
    <issue name="Issue B">30</issue>
  </presentingIssues>
  <ageDistribution>
    <ageGroup name="18-24">50</ageGroup>
    <ageGroup name="25-34">100</ageGroup>
  </ageDistribution>
</data>
```

## Customization

### Styling
The application uses custom CSS in `src/styles/Dashboard.css`. You can modify this file to:
- Change color schemes
- Adjust layout and spacing
- Modify card and chart styles
- Update responsive breakpoints

### Data Processing
The XML parsing logic can be modified in `src/utils/xmlParser.ts` to handle different XML structures or data formats.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers. 