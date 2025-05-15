import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { utente } = useContext(AuthContext);

  if (!utente) {
    // Se non c'è un utente loggato, rimanda al login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;

