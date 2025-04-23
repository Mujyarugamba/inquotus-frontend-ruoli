import React, { useState } from 'react';

const RecuperaPassword = () => {
  const [email, setEmail] = useState('');
  const [nuovaPassword, setNuovaPassword] = useState('');
  const [messaggio, setMessaggio] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch('https://inquotus-backend-auth.onrender.com/api/recupera-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, nuovaPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setMessaggio('Password aggiornata con successo!');
      } else {
        setMessaggio(data.error || 'Errore');
      }
    } catch (err) {
      setMessaggio('Errore di connessione al server');
    }
  };

  return (
    <div>
      <h2>Recupera Password</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email registrata" value={email} onChange={e => setEmail(e.target.value)} required /><br />
        <input type="password" placeholder="Nuova password" value={nuovaPassword} onChange={e => setNuovaPassword(e.target.value)} required /><br />
        <button type="submit">Aggiorna Password</button>
      </form>
      {messaggio && <p>{messaggio}</p>}
    </div>
  );
};

export default RecuperaPassword;
