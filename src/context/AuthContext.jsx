import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [utente, setUtente] = useState(null);

  const checkToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000; // in secondi

        if (decoded.exp < now) {
          logout(); // token scaduto
        } else {
          setUtente(decoded);
        }
      } catch (err) {
        console.error('Token non valido:', err);
        logout();
      }
    }
  };

  useEffect(() => {
    checkToken();
    const interval = setInterval(checkToken, 60 * 1000); // controlla ogni minuto
    return () => clearInterval(interval);
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    setUtente(decoded);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUtente(null);
  };

  return (
    <AuthContext.Provider value={{ utente, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
