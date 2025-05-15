import React from 'react';

// Contenitore principale della tabella
export function Table({ children }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left text-gray-700 border border-gray-300">
        {children}
      </table>
    </div>
  );
}

// Header della tabella (thead)
export function TableHeader({ children }) {
  return <thead className="bg-gray-100 text-xs uppercase">{children}</thead>;
}

// Riga della tabella (tr)
export function TableRow({ children }) {
  return <tr className="border-b">{children}</tr>;
}

// Intestazione colonna (th)
export function TableHead({ children, className = "" }) {
  return (
    <th className={`px-4 py-2 font-medium text-gray-600 ${className}`}>
      {children}
    </th>
  );
}

// Corpo della tabella (tbody)
export function TableBody({ children }) {
  return <tbody>{children}</tbody>;
}

// Cella della tabella (td)
export function TableCell({ children, className = "" }) {
  return (
    <td className={`px-4 py-2 text-gray-800 ${className}`}>
      {children}
    </td>
  );
}

