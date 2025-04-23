import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE } from '../config/config';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await fetch(`${API_BASE}/api/password-reset/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (res.ok) {
        setMsg('✅ Password aggiornata!');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setMsg(data.error);
      }
    } catch (err) {
      setMsg('Errore di connessione al server');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2>Imposta nuova password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Nuova password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', marginBottom: '1rem' }}
        />
        <button type="submit">Aggiorna password</button>
      </form>
      {msg && <p style={{ marginTop: '1rem' }}>{msg}</p>}
    </div>
  );
};

export default ResetPassword;
