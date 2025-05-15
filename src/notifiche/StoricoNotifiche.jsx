import React, { useEffect, useState, useContext } from 'react';
import supabase from '../config/supabaseClient';
import { AuthContext } from '../context/AuthContext';

const StoricoNotifiche = ({ setNotificheCount }) => {
  const { utente } = useContext(AuthContext);
  const utenteEmail = utente?.email;

  const [notifiche, setNotifiche] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState('tutte');

  const fetchNotifiche = async () => {
    if (!utenteEmail) return;

    const { data, error } = await supabase
      .from('notifiche')
      .select('*')
      .eq('email_utente', utenteEmail)
      .order('timestamp', { ascending: false });

    if (!error) setNotifiche(data);
    setLoading(false);
  };

  const segnaTutteComeLette = async () => {
    if (!utenteEmail) return;

    await supabase
      .from('notifiche')
      .update({ letto: true })
      .eq('email_utente', utenteEmail)
      .eq('letto', false);

    if (setNotificheCount) setNotificheCount(0);
    fetchNotifiche();
  };

  useEffect(() => {
    fetchNotifiche();
  }, [utenteEmail]);

  useEffect(() => {
    if (!utenteEmail) return;

    const channel = supabase
      .channel('realtime-notifiche')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifiche' },
        (payload) => {
          if (payload.new?.email_utente === utenteEmail) {
            fetchNotifiche();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [utenteEmail]);

  const notificheFiltrate = filtroTipo === 'tutte'
    ? notifiche
    : notifiche.filter(n => n.tipo === filtroTipo);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>📜 Storico notifiche</h2>

      <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={segnaTutteComeLette}
          style={{
            padding: '0.4rem 0.8rem',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          ✅ Segna tutte come lette
        </button>

        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          style={{ padding: '0.4rem', borderRadius: '5px' }}
        >
          <option value="tutte">Tutte</option>
          <option value="INSERT">Nuove richieste</option>
          <option value="UPDATE">Modifiche</option>
          <option value="DELETE">Cancellazioni</option>
        </select>
      </div>

      {loading ? (
        <p>Caricamento...</p>
      ) : notificheFiltrate.length === 0 ? (
        <p>Nessuna notifica registrata.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {notificheFiltrate.map((n, i) => (
            <li
              key={i}
              style={{
                marginBottom: '1rem',
                padding: '1rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor: n.letto ? '#f9f9f9' : '#e8f4ff',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '0.3rem' }}>{n.tipo}</div>
              <div style={{ fontSize: '0.9rem', color: '#555' }}>
                {n.descrizione || 'Nessuna descrizione disponibile.'}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.5rem' }}>
                {new Date(n.timestamp).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StoricoNotifiche;


