import React, { useEffect, useState } from 'react';
import { API_BASE } from '../config';

const WhoAmI = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [errore, setErrore] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setErrore('Token mancante');
      return;
    }

    fetch(`${API_BASE}/api/whoami`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setErrore(data.error);
        } else {
          setUserInfo(data);
        }
      })
      .catch(() => setErrore('Errore di rete'));
  }, []);

  if (errore) return <p style={{ color: 'red' }}>❌ {errore}</p>;
  if (!userInfo) return <p>⏳ Caricamento info utente...</p>;

  return (
    <div style={{ background: '#eee', padding: '1rem', margin: '1rem 0' }}>
      👤 Loggato come: <strong>{userInfo.email}</strong><br />
      🛠️ Ruolo: <strong>{userInfo.ruolo}</strong>
    </div>
  );
};

export default WhoAmI;
