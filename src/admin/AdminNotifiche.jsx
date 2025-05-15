import React, { useEffect, useState } from 'react';
import supabase from '../config/supabaseClient';

const AdminNotifiche = () => {
  const [notifiche, setNotifiche] = useState([]);
  const [nonLette, setNonLette] = useState(0);

  useEffect(() => {
    const fetchIniziali = async () => {
      const { data, error } = await supabase
        .from('notifiche')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(20);

      if (!error) {
        setNotifiche(data);
        setNonLette(data.filter(n => !n.letto).length);
      }
    };

    fetchIniziali();

    const channel = supabase
      .channel('notifiche-admin')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifiche' }, payload => {
        setNotifiche(prev => [payload.new, ...prev]);
        if (!payload.new.letto) {
          setNonLette(prev => prev + 1);
        }
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>🔔 Notifiche in tempo reale (Admin)</h2>
      <p><strong>Non lette:</strong> {nonLette}</p>

      <ul>
        {notifiche.map((n, i) => (
          <li key={i} style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc' }}>
            <strong>{n.tipo}</strong> da <em>{n.email_utente}</em><br />
            <small>{new Date(n.timestamp).toLocaleString()}</small>{' '}
            {!n.letto && <span style={{ color: 'red' }}>🆕</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminNotifiche;
