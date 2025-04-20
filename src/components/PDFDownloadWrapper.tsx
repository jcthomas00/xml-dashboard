import React, { useState, useEffect } from 'react';
import { PDFDownloadLink, BlobProviderParams } from '@react-pdf/renderer';
import { toast } from 'react-hot-toast';

// This wrapper component suppresses the React 18 warning from @react-pdf/renderer
interface PDFDownloadWrapperProps {
  document: React.ReactElement;
  fileName: string;
  children: (props: { loading: boolean; error: Error | null }) => React.ReactElement;
}

const PDFDownloadWrapper: React.FC<PDFDownloadWrapperProps> = ({
  document,
  fileName,
  children,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleFontError = (event: ErrorEvent) => {
      console.warn('Font loading error:', event.error);
      setError(event.error || new Error('Font loading failed'));
      toast.error('Error loading fonts for PDF generation. Using fallback fonts.');
    };

    window.addEventListener('error', (event) => {
      if (event.target instanceof HTMLLinkElement && event.target.href.includes('font')) {
        handleFontError(event as ErrorEvent);
      }
    });

    // Set loading to false after initial font check
    setLoading(false);

    return () => {
      window.removeEventListener('error', handleFontError);
    };
  }, []);

  return (
    <PDFDownloadLink
      document={document}
      fileName={fileName}
      className="download-link"
    >
      {(props: BlobProviderParams) => {
        const isLoading = loading || props.loading;
        const hasError = error || props.error;

        if (hasError) {
          console.error('PDF generation error:', hasError);
        }

        return children({ loading: isLoading, error: hasError });
      }}
    </PDFDownloadLink>
  );
};

export default PDFDownloadWrapper; 