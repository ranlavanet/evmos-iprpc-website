import React, { useState } from 'react';

function InputChecker({ onButtonPress }) {
  const [inputValue, setInputValue] = useState('');
  const [isNumber, setIsNumber] = useState(false);

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setInputValue(newValue);

    // Check if the input is a number
    const isInputNumber = !isNaN(newValue);
    setIsNumber(isInputNumber);
  };

  const handleButtonPress = () => {
    if (isNumber) {
      onButtonPress(inputValue); // Pass the input value to the callback
    }
  };

  return (
    <div>
      <label htmlFor="inputField">Amount: </label>
      <input
        type="text"
        id="inputField"
        name="inputField"
        placeholder=" Enter Amount"
        onChange={handleInputChange}
        value={inputValue}
      />
      {isNumber ? (
        <button
          className="px-6 py-2 text-white bg-green-600 rounded-md md:ml-5"
          onClick={handleButtonPress}
        >
          Launch Transaction
        </button>
      ) : (
        <button
          className="px-6 py-2 text-white bg-gray-600 rounded-md md:ml-5"
          disabled
        >
          Invalid Input
        </button>
      )}
    </div>
  );
}

export default InputChecker;
