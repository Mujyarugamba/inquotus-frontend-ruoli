import React, { useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const SbloccoSuccesso = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const richiestaId = searchParams.get('richiesta_id');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!richiestaId || !token) return;

    const registraSblocco = async () => {
      try {
        await fetch(`${process.env.REACT_APP_API_BASE}/api/sblocchi/crea`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ richiesta_id: richiestaId })
        });
      } catch (err) {
        console.error('Errore durante la registrazione dello sblocco:', err);
      }
    };

    registraSblocco();
  }, [richiestaId, token]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>✅ Sblocco completato con successo!</h2>
      <p>Ora puoi visualizzare i contatti della richiesta direttamente nella tua area lavoro.</p>
      <Link to="/richieste-lavoro-in-quota">
        <button style={{
          marginTop: '1rem',
          padding: '0.7rem 1.2rem',
          backgroundColor: '#28a745',
          color: 'white',
          fontSize: '1rem',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}>
          🔙 Torna alle richieste
        </button>
      </Link>
    </div>
  );
};

export default SbloccoSuccesso;
