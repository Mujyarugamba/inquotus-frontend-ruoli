import React, { useState } from 'react';

export function Switch({ checked = false, onChange }) {
  const [isOn, setIsOn] = useState(checked);

  const toggle = () => {
    const newValue = !isOn;
    setIsOn(newValue);
    if (onChange) onChange(newValue);
  };

  return (
    <div
      onClick={toggle}
      className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
        isOn ? "bg-green-400" : "bg-gray-400"
      }`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${
          isOn ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </div>
  );
}
