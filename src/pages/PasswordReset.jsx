import React, { useState } from 'react';
import { API_BASE } from '../config';

const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await fetch(`${API_BASE}/api/password-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      setMsg(data.message || data.error);
    } catch (err) {
      setMsg('Errore di connessione al server');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2>Recupera password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Inserisci la tua email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', marginBottom: '1rem' }}
        />
        <button type="submit">Invia email di recupero</button>
      </form>
      {msg && <p style={{ marginTop: '1rem' }}>{msg}</p>}
    </div>
  );
};

export default PasswordReset;
