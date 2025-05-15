// src/components/ui/select.jsx
import React from 'react';

export const Select = ({ children, value, onValueChange, className }) => (
  <select
    value={value}
    onChange={(e) => onValueChange(e.target.value)}
    className={`border px-2 py-1 rounded ${className || ''}`}
  >
    {children}
  </select>
);

export const SelectItem = ({ value, children }) => (
  <option value={value}>{children}</option>
);


