import React, { useEffect, useState } from 'react';
import { API_BASE } from '../config';

const SblocchiEffettuati = () => {
  const [sblocchi, setSblocchi] = useState([]);
  const [errore, setErrore] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE}/api/sblocchi-effettuati`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setSblocchi(data);
        else setErrore(data.error || 'Errore caricamento dati');
      })
      .catch(() => setErrore('Errore di rete'));
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>📂 Storico Sblocchi</h2>
      {errore && <p style={{ color: 'red' }}>{errore}</p>}
      {sblocchi.length === 0 && !errore ? (
        <p>Nessuno sblocco effettuato.</p>
      ) : (
        <ul>
          {sblocchi.map(s => (
            <li key={s.id}>
              <strong>{s.categoria}</strong> – {s.localita}, {s.provincia} ({s.regione})<br />
              Sbloccato il: {new Date(s.data_sblocco).toLocaleDateString()} – {s.prezzo_pagato} €
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SblocchiEffettuati;

