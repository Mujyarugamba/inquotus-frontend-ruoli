import React, { useEffect, useState } from 'react';
import { API_BASE } from '../config/config';

const RichiesteLavoroInQuota = () => {
  const [richieste, setRichieste] = useState([]);
  const [provinciaFiltro, setProvinciaFiltro] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRichieste = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/richieste/pubbliche`);
        const data = await res.json();
        setRichieste(data);
      } catch (err) {
        console.error('Errore nel caricamento delle Richieste Lavoro In Quota:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRichieste();
  }, []);

  const richiesteFiltrate = richieste.filter(r =>
    provinciaFiltro === '' || r.provincia.toLowerCase().includes(provinciaFiltro.toLowerCase())
  );

  return (
    <div style={{ padding: '1rem' }}>
      <h2>📢 Richieste di lavoro in quota</h2>
      <p>Visualizza le richieste pubblicate da committenti in tutta Italia. Per vedere i contatti, effettua il login.</p>

      <input
        type="text"
        placeholder="Filtra per provincia (es. Milano)"
        value={provinciaFiltro}
        onChange={(e) => setProvinciaFiltro(e.target.value)}
        style={{ margin: '1rem 0', padding: '0.5rem', width: '100%' }}
      />

      {loading ? (
        <p>⏳ Caricamento richieste...</p>
      ) : richiesteFiltrate.length === 0 ? (
        <p>Nessuna richiesta trovata.</p>
      ) : (
        <ul>
          {richiesteFiltrate.map((r) => (
            <li key={r.id} style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '1rem' }}>
              <strong>Categoria:</strong> {r.categoria} <br />
              <strong>Regione:</strong> {r.regione} <br />
              <strong>Provincia:</strong> {r.provincia} <br />
              <strong>Comune:</strong> {r.localita} <br />
              <strong>Descrizione:</strong> {r.descrizione.slice(0, 100)}... <br />
              <em>🔒 Effettua l'accesso per sbloccare i contatti</em>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RichiesteLavoroInQuota;
