import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PublicOnlyRoute = ({ children }) => {
  const { utente } = useContext(AuthContext);

  if (utente) {
    // Se sei già loggato, non puoi accedere a login o register: vai alla tua Home
    if (utente.ruolo === 'committente') {
      return <Navigate to="/home" replace />;
    } else if (utente.ruolo === 'impresa') {
      return <Navigate to="/impresa" replace />;
    } else if (utente.ruolo === 'professionista') {
      return <Navigate to="/professionista" replace />;
    }
  }

  return children;
};

export default PublicOnlyRoute;

