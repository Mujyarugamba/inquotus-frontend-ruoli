// src/TestLogin.jsx
import React, { useEffect, useState } from 'react';
import { API_BASE } from './config.test';

const TestLogin = () => {
  const [data, setData] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('🧪 Connessione in corso a:', API_BASE);
    fetch(`${API_BASE}/api/utente`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(json => {
        console.log('✅ Dati ricevuti:', json);
        setData(JSON.stringify(json));
      })
      .catch(err => {
        console.error('❌ Errore:', err);
        setError('Errore di connessione');
      });
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Test API Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {data && <pre>{data}</pre>}
    </div>
  );
};

export default TestLogin;

