import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children, ruolo }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [autorizzato, setAutorizzato] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      localStorage.setItem('redirectAfterLogin', location.pathname);
      setAutorizzato(false);
      setLoading(false);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      if (ruolo && payload.ruolo !== ruolo) {
        setAutorizzato(false);
      } else {
        setAutorizzato(true);
      }
    } catch (err) {
      console.error('Errore parsing token:', err);
      setAutorizzato(false);
    } finally {
      setLoading(false);
    }
  }, [location.pathname, ruolo]);

  if (loading) return <p style={{ padding: '2rem' }}>⏳ Verifica autenticazione...</p>;
  if (!autorizzato) return <Navigate to="/login" />;

  return children;
};

export default PrivateRoute;
