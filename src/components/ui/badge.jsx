import React from 'react';

export function Badge({ children, color = "blue" }) {
  const base = "inline-block px-3 py-1 text-xs font-semibold rounded-full";
  const colors = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
    gray: "bg-gray-100 text-gray-800",
    yellow: "bg-yellow-100 text-yellow-800",
  };

  return <span className={`${base} ${colors[color] || colors.blue}`}>{children}</span>;
}
