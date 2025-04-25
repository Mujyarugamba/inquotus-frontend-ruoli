import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_BASE } from '../config';
import { createClient } from '@supabase/supabase-js';
import SalvaButton from '../components/SalvaButton'; // ✅ Importa il bottone

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const DettaglioRichiesta = () => {
  const { id } = useParams();
  const [richiesta, setRichiesta] = useState(null);
  const [errore, setErrore] = useState('');
  const [showSegnala, setShowSegnala] = useState(false);
  const [motivoSegnalazione, setMotivoSegnalazione] = useState('');
  const [segnalazioneInviata, setSegnalazioneInviata] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchRichiesta = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/richiesta/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Errore nel caricamento');
        setRichiesta(data);
      } catch (err) {
        setErrore(err.message);
      }
    };

    const getUserId = () => {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserId(payload.id);
      }
    };

    fetchRichiesta();
    getUserId();
  }, [id]);

  const segnalaRichiesta = async () => {
    if (!motivoSegnalazione.trim()) return alert("Inserisci un motivo valido");

    const token = localStorage.getItem('token');
    const payload = JSON.parse(atob(token.split('.')[1]));

    const { error } = await supabase.from('segnalazioni').insert({
      richiesta_id: richiesta.id,
      email_committente: richiesta.email_committente,
      email_segnalante: payload.email,
      motivo: motivoSegnalazione,
    });

    if (!error) {
      setSegnalazioneInviata(true);
      setShowSegnala(false);
    } else {
      alert("Errore nell'invio segnalazione");
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>📄 Dettaglio richiesta</h2>

      {errore && <p style={{ color: 'red' }}>{errore}</p>}

      {richiesta ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p><strong>Categoria:</strong> {richiesta.categoria}</p>
            {userId && <SalvaButton richiestaId={richiesta.id} userId={userId} />}
          </div>
          <p><strong>Località:</strong> {richiesta.localita}</p>
          <p><strong>Descrizione:</strong> {richiesta.descrizione}</p>
          <p><strong>Contatti:</strong> {richiesta.contatti}</p>
          <p><strong>Data:</strong> {new Date(richiesta.data_inserimento).toLocaleString()}</p>

          {!segnalazioneInviata && (
            <>
              <button onClick={() => setShowSegnala(true)}>🚩 Segnala richiesta</button>

              {showSegnala && (
                <div style={{ marginTop: '1rem' }}>
                  <textarea
                    value={motivoSegnalazione}
                    onChange={(e) => setMotivoSegnalazione(e.target.value)}
                    placeholder="Motivo della segnalazione..."
                    rows={3}
                    style={{ width: '100%', marginBottom: '0.5rem' }}
                  />
                  <button onClick={segnalaRichiesta} style={{ backgroundColor: 'red', color: 'white' }}>
                    Invia segnalazione
                  </button>
                </div>
              )}
            </>
          )}

          {segnalazioneInviata && <p style={{ color: 'green' }}>✅ Richiesta segnalata agli amministratori.</p>}
        </div>
      ) : (
        <p>Caricamento...</p>
      )}
    </div>
  );
};

export default DettaglioRichiesta;
