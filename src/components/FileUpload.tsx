import React, { useCallback } from 'react';
import './FileUpload.css';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/xml') {
      onFileUpload(file);
    } else {
      alert('Please upload a valid XML file');
    }
  }, [onFileUpload]);

  return (
    <div className="file-upload-container">
      <label htmlFor="xml-upload" className="file-upload-label">
        Upload XML File
        <input
          id="xml-upload"
          type="file"
          accept=".xml"
          onChange={handleFileChange}
          className="file-upload-input"
        />
      </label>
    </div>
  );
};

export default FileUpload; 