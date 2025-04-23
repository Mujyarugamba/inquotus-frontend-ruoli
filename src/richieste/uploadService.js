import React, { useEffect, useState } from 'react';
import { API_BASE } from '../config';

const SblocchiEffettuati = () => {
  const [sbloccati, setSbloccati] = useState([]);
  const [errore, setErrore] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setErrore('Utente non autenticato.');
      return;
    }

    fetch(`${API_BASE}/api/sbloccati`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Errore nel recupero');
        return res.json();
      })
      .then(data => setSbloccati(data))
      .catch(err => setErrore(err.message));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Richieste sbloccate</h2>
      {errore && <p style={{ color: 'red' }}>{errore}</p>}
      {sbloccati.length === 0 && !errore && <p>Nessuna richiesta sbloccata trovata.</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {sbloccati.map((r) => (
          <li key={r.richiesta_id} style={{ marginBottom: '1rem', border: '1px solid #ccc', borderRadius: '8px', padding: '1rem' }}>
            <strong>Categoria:</strong> {r.categoria}<br />
            <strong>Località:</strong> {r.localita}<br />
            <strong>Descrizione:</strong> {r.descrizione}<br />
            <strong>Data richiesta:</strong> {new Date(r.data_inserimento).toLocaleString()}<br />
            <strong>Data sblocco:</strong> {new Date(r.data_sblocco).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SblocchiEffettuati;

