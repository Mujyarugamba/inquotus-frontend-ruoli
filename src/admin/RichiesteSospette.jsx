import React, { useEffect, useState } from 'react';
import { API_BASE } from '../config/config';

const RichiesteSospette = () => {
  const [segnalazioni, setSegnalazioni] = useState([]);
  const [messaggio, setMessaggio] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchSegnalazioni = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/segnalazioni`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Errore nel caricamento');
      setSegnalazioni(data);
    } catch (err) {
      setMessaggio(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSegnalazioni();
  }, []);

  const archiviaRichiesta = async (id) => {
    if (!window.confirm('Vuoi archiviare questa richiesta?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/archivia-richiesta/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!res.ok) throw new Error('Errore durante archiviazione');
      setMessaggio('✅ Richiesta archiviata');
      fetchSegnalazioni();
    } catch (err) {
      setMessaggio(`❌ ${err.message}`);
    }
  };

  const rimuoviRichiesta = async (id) => {
    if (!window.confirm('Rimuovere questa richiesta?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/rimuovi-richiesta/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!res.ok) throw new Error('Errore durante rimozione');
      setMessaggio('✅ Richiesta rimossa');
      fetchSegnalazioni();
    } catch (err) {
      setMessaggio(`❌ ${err.message}`);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>🚨 Richieste sospette / segnalate</h2>

      {messaggio && (
        <p style={{ color: messaggio.startsWith('✅') ? 'green' : 'red' }}>{messaggio}</p>
      )}

      {loading ? (
        <p>Caricamento...</p>
      ) : segnalazioni.length === 0 ? (
        <p>Nessuna segnalazione trovata.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: '100%', marginTop: '1rem' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Richiesta</th>
              <th>Email committente</th>
              <th>Motivo</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {segnalazioni.map(s => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.richiesta_id}</td>
                <td>{s.email_committente}</td>
                <td>{s.motivo}</td>
                <td>
                  <button onClick={() => archiviaRichiesta(s.richiesta_id)}>🗂️ Archivia</button>{' '}
                  <button onClick={() => rimuoviRichiesta(s.richiesta_id)} style={{ color: 'red' }}>🗑️ Rimuovi</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RichiesteSospette;