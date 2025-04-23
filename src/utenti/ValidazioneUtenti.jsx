import React, { useEffect, useState } from 'react';
import { API_BASE } from '../config';

const ValidazioneUtenti = () => {
  const [utenti, setUtenti] = useState([]);
  const [errore, setErrore] = useState('');
  const [successo, setSuccesso] = useState('');

  const fetchUtenti = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE}/api/da-approvare`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Errore nel recupero utenti');
      const data = await res.json();
      setUtenti(data);
    } catch (err) {
      setErrore(err.message);
    }
  };

  const approvaUtente = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE}/api/approva/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Errore approvazione');
      setSuccesso('Utente approvato con successo!');
      fetchUtenti(); // aggiorna la lista
    } catch (err) {
      setErrore(err.message);
    }
  };

  useEffect(() => {
    fetchUtenti();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Validazione utenti</h2>
      {errore && <p style={{ color: 'red' }}>{errore}</p>}
      {successo && <p style={{ color: 'green' }}>{successo}</p>}
      {utenti.length === 0 && <p>Nessun utente da approvare.</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {utenti.map((u) => (
          <li key={u.id} style={{ border: '1px solid #ccc', marginBottom: '1rem', padding: '1rem' }}>
            <strong>Email:</strong> {u.email}<br />
            <strong>Ruolo:</strong> {u.ruolo}<br />
            <button onClick={() => approvaUtente(u.id)}>✅ Approva</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ValidazioneUtenti;

