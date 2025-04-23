import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE } from '../config/config';
import { supabase } from '../config/supabaseClient'; // ✅
import { toast } from 'react-toastify';

const RichiesteMie = () => {
  const [richieste, setRichieste] = useState([]);
  const [messaggio, setMessaggio] = useState('');
  const [utenteInfo, setUtenteInfo] = useState(null);
  const [caricamento, setCaricamento] = useState(false);
  const [notifiche, setNotifiche] = useState([]);
  const [mostraNotifiche, setMostraNotifiche] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const playSuono = () => {
    const audio = new Audio('/sounds/notify.mp3');
    audio.play();
  };

  const salvaNotifica = async (tipo, email) => {
    await supabase.from('notifiche').insert({
      tipo,
      email_utente: email,
      timestamp: new Date().toISOString()
    });
  };

  const fetchRichieste = () => {
    if (!token) return;
    setCaricamento(true);
    fetch(`${API_BASE}/api/richieste/mie`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRichieste(data);
          setMessaggio('');
        } else {
          setMessaggio('❌ Errore nel caricamento delle richieste');
        }
      })
      .catch(() => setMessaggio('❌ Errore di rete'))
      .finally(() => setCaricamento(false));
  };

  useEffect(() => {
    if (!token) return;
    fetchRichieste();
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUtenteInfo(payload);
    } catch {
      setUtenteInfo(null);
    }
  }, [token]);

  useEffect(() => {
    if (!utenteInfo?.email) return;

    const richiesteChannel = supabase.channel('richieste-channel');

    richiesteChannel
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'richieste',
        filter: `email=eq.${utenteInfo.email}`
      }, async (payload) => {
        let tipo;
        switch (payload.eventType) {
          case 'INSERT':
            tipo = 'Nuova richiesta';
            toast.success('🆕 Hai creato una nuova richiesta.');
            break;
          case 'UPDATE':
            tipo = 'Modifica richiesta';
            toast.info('✏️ Una tua richiesta è stata modificata.');
            break;
          case 'DELETE':
            tipo = 'Eliminazione richiesta';
            toast.warn('🗑️ Una tua richiesta è stata eliminata.');
            break;
          default:
            tipo = `Altro evento: ${payload.eventType}`;
        }
        playSuono();
        setNotifiche(prev => [...prev, { tipo, ts: new Date() }]);
        await salvaNotifica(tipo, utenteInfo.email);
        fetchRichieste();
      })
      .subscribe();

    const sblocchiChannel = supabase.channel('sblocchi-channel');

    sblocchiChannel
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'sblocchi',
        filter: `email_committente=eq.${utenteInfo.email}`
      }, async () => {
        const tipo = 'Sblocco richiesta';
        toast.info('🔓 Una tua richiesta è stata sbloccata da un utente.');
        playSuono();
        setNotifiche(prev => [...prev, { tipo, ts: new Date() }]);
        await salvaNotifica(tipo, utenteInfo.email);
        fetchRichieste();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(richiesteChannel);
      supabase.removeChannel(sblocchiChannel);
    };
  }, [utenteInfo]);

  const eliminaRichiesta = async (id) => {
    if (!window.confirm('Sei sicuro di voler eliminare questa richiesta?')) return;

    try {
      const res = await fetch(`${API_BASE}/api/richiesta/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (res.ok) {
        setRichieste(prev => prev.filter(r => r.id !== id));
        setMessaggio('✅ Richiesta eliminata con successo');
      } else {
        setMessaggio(`❌ ${data.error || 'Errore eliminazione'}`);
      }
    } catch {
      setMessaggio('❌ Errore di rete');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>📋 Le mie richieste</h2>

      <div style={{ marginBottom: '1rem', position: 'relative' }}>
        <button onClick={() => setMostraNotifiche(!mostraNotifiche)}>
          🔔 Notifiche {notifiche.length > 0 && (
            <span style={{
              backgroundColor: 'red',
              color: 'white',
              borderRadius: '50%',
              padding: '0 6px',
              fontSize: '0.8rem',
              marginLeft: '4px'
            }}>{notifiche.length}</span>
          )}
        </button>
        {mostraNotifiche && (
          <ul style={{
            position: 'absolute',
            top: '2rem',
            right: 0,
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '6px',
            padding: '1rem',
            width: '300px',
            zIndex: 1000
          }}>
            {notifiche.length === 0 ? (
              <li>Nessuna notifica.</li>
            ) : (
              notifiche.slice().reverse().map((n, i) => (
                <li key={i}>
                  📌 <strong>{n.tipo}</strong> <br />
                  <small>{n.ts.toLocaleTimeString()}</small>
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      {utenteInfo && (
        <p><strong>👤 {utenteInfo.email}</strong> | Ruolo: <strong>{utenteInfo.ruolo}</strong></p>
      )}

      {messaggio && (
        <p style={{ color: messaggio.startsWith('✅') ? 'green' : 'red' }}>{messaggio}</p>
      )}

      {caricamento ? (
        <p>Caricamento richieste...</p>
      ) : richieste.length === 0 ? (
        <p>Non hai ancora inserito richieste.</p>
      ) : (
        <ul>
          {richieste.map(r => (
            <li key={r.id} style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '1rem' }}>
              <strong>Categoria:</strong> {r.categoria}<br />
              <strong>Regione:</strong> {r.regione}<br />
              <strong>Provincia:</strong> {r.provincia}<br />
              <strong>Comune:</strong> {r.localita}<br />
              <strong>Data:</strong> {new Date(r.data_inserimento).toLocaleDateString()}<br />
              <div style={{ marginTop: '0.5rem' }}>
                <button onClick={() => navigate(`/modifica-richiesta/${r.id}`)}>✏️ Modifica</button>{' '}
                <button onClick={() => eliminaRichiesta(r.id)}>🗑️ Elimina</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RichiesteMie;
