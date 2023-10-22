import React from 'react';

const ParsedDataComponent = ({ data }) => {
  // Calculate the width of the container based on the length of the data
  const containerWidth = `${Math.min(600, JSON.stringify(data, null, 2).length * 20)}px`;

  // Set padding to create a buffer from the edges
  const containerPadding = '8px';

  return (
    <div className="border border-gray-300 rounded-md" style={{ width: containerWidth, padding: containerPadding }}>
      {/* Display the parsed data here */}
      <h2>Parsed Data</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default ParsedDataComponent;
