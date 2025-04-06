# UTMB EAP Dashboard

A React-based dashboard for visualizing Employee Assistance Program (EAP) data from UTMB.

## Features

- Interactive charts and graphs displaying EAP statistics
- Key metrics visualization
- PDF export functionality
- Responsive design for all screen sizes

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd uteap-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Place your UTMB.xml file in the `public` directory.

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

## Data Format

The application expects an XML file named `UTMB.xml` in the following format:
- Contains EAP statistics and metrics
- Includes data for employees covered, cases by type, gender distribution, division distribution, and presenting issues
- Data should be structured according to the UTMB EAP report format

## License

This project is licensed under the MIT License - see the LICENSE file for details. 