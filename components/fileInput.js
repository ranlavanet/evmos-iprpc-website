import React, { useState } from 'react';

const FileInputComponent = ({ onFileUpload }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/json') {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const jsonData = JSON.parse(e.target.result);
            setFile(selectedFile);
            onFileUpload(jsonData); // Pass the parsed data to the parent component
          } catch (error) {
            console.error('Error parsing JSON:', error);
          }
        };
        reader.readAsText(selectedFile);
      } else {
        alert('Please select a .json file.');
      }
    }
  };

  return (
    <div>
      <input type="file" accept=".json" onChange={handleFileChange} />
    </div>
  );
};

export default FileInputComponent;
