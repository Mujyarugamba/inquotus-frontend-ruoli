import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../config/supabaseClient';

const RichiesteSalvate = () => {
  const [richieste, setRichieste] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRichieste = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      const payload = JSON.parse(atob(token.split('.')[1]));
      const emailUtente = payload.email;

      const { data, error } = await supabase
        .from('richieste_salvate')
        .select('richiesta_id, richieste(*)')
        .eq('email_utente', emailUtente);

      if (error) {
        console.error('Errore:', error);
        setErrore('Errore nel recupero delle richieste salvate');
      } else {
        setRichieste(data.map(r => r.richieste));
      }
      setLoading(false);
    };

    fetchRichieste();
  }, []);

  if (loading) return <p>Caricamento richieste salvate...</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>⭐ Le mie richieste salvate</h2>
      {errore && <p style={{ color: 'red' }}>{errore}</p>}
      {richieste.length === 0 ? (
        <p>Non hai ancora salvato richieste.</p>
      ) : (
        <ul>
          {richieste.map((r) => (
            <li key={r.id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
              <strong>Categoria:</strong> {r.categoria}<br />
              <strong>Località:</strong> {r.localita}, {r.provincia}, {r.regione}<br />
              <strong>Data:</strong> {new Date(r.data_inserimento).toLocaleDateString()}<br />
              <button onClick={() => navigate(`/richiesta/${r.id}`)}>
                🔍 Dettagli
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RichiesteSalvate;
