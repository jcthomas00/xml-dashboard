import React, { useEffect } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';

// This wrapper component suppresses the React 18 warning from @react-pdf/renderer
interface PDFDownloadWrapperProps {
  document: React.ReactElement;
  fileName: string;
  children: (props: { loading: boolean; error: Error | null }) => React.ReactElement;
}

const PDFDownloadWrapper: React.FC<PDFDownloadWrapperProps> = ({ document, fileName, children }) => {
  // Suppress the React 18 warning
  useEffect(() => {
    const originalConsoleError = console.error;
    console.error = (...args) => {
      if (
        typeof args[0] === 'string' &&
        args[0].includes('ReactDOM.render is no longer supported in React 18')
      ) {
        return;
      }
      originalConsoleError(...args);
    };

    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  return (
    <PDFDownloadLink document={document} fileName={fileName}>
      {children}
    </PDFDownloadLink>
  );
};

export default PDFDownloadWrapper; 