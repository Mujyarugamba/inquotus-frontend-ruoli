import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicOnlyRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      switch (payload.ruolo) {
        case 'committente':
          return <Navigate to="/home" />;
        case 'impresa':
          return <Navigate to="/impresa" />;
        case 'professionista':
          return <Navigate to="/professionista" />;
        default:
          return <Navigate to="/" />;
      }
    } catch (err) {
      console.error("Token non valido:", err);
      localStorage.removeItem('token');
    }
  }

  return children;
};

export default PublicOnlyRoute;

