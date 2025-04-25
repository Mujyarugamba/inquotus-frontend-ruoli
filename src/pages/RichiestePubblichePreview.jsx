import React, { useEffect, useState } from 'react';
import { API_BASE } from '../config';

const RichiesteLavoroInQuotaPreview = () => {
  const [richieste, setRichieste] = useState([]);
  const [regione, setRegione] = useState('');
  const [provincia, setProvincia] = useState('');
  const [regioni, setRegioni] = useState([]);
  const [provinceDisponibili, setProvinceDisponibili] = useState([]);
  const [errore, setErrore] = useState('');

  useEffect(() => {
    fetch('/data/regioni.json').then(r => r.json()).then(setRegioni);
  }, []);

  useEffect(() => {
    if (regione) {
      fetch(`/data/province/${regione}.json`)
        .then(r => r.json())
        .then(setProvinceDisponibili);
    } else {
      setProvinceDisponibili([]);
    }
  }, [regione]);

  useEffect(() => {
    fetch(`${API_BASE}/api/richieste/pubbliche-preview`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setRichieste(data);
        else setErrore('Errore caricamento Richieste Lavoro In Quota');
      })
      .catch(() => setErrore('Errore rete'));
  }, []);

  const richiesteFiltrate = richieste.filter(r =>
    (!regione || r.regione === regione) &&
    (!provincia || r.provincia === provincia)
  );

  return (
    <div style={{ padding: '1rem' }}>
      <h2>🔍 Richieste di lavoro in quota</h2>

      <div style={{ marginBottom: '1rem' }}>
        <select value={regione} onChange={e => setRegione(e.target.value)}>
          <option value="">Tutte le regioni</option>
          {regioni.map(r => <option key={r} value={r}>{r}</option>)}
        </select>{' '}
        <select value={provincia} onChange={e => setProvincia(e.target.value)} disabled={!regione}>
          <option value="">Tutte le province</option>
          {provinceDisponibili.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {errore && <p style={{ color: 'red' }}>{errore}</p>}

      {richiesteFiltrate.length === 0 ? (
        <p>Nessuna richiesta trovata.</p>
      ) : (
        <ul>
          {richiesteFiltrate.map(r => (
            <li key={r.id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
              <strong>Categoria:</strong> {r.categoria}<br />
              <strong>Comune:</strong> {r.localita} ({r.provincia}, {r.regione})<br />
              <strong>Urgenza:</strong> {r.urgente ? '⚠️ Sì' : 'No'}<br />
              <strong>Descrizione:</strong> {r.descrizione.slice(0, 80)}...<br />
              <em style={{ color: 'gray' }}>🔒 Registrati o accedi per vedere i contatti</em>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RichiesteLavoroInQuotaPreview;
