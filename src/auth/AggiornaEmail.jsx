import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const AggiornaEmail = () => {
  const [nuovaEmail, setNuovaEmail] = useState('');
  const [messaggio, setMessaggio] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAggiornaEmail = async () => {
    setLoading(true);
    setMessaggio('');
    const { error } = await supabase.auth.updateUser({
      email: nuovaEmail,
    });

    if (error) {
      setMessaggio(`❌ Errore: ${error.message}`);
    } else {
      setMessaggio('✅ Email aggiornata! Controlla la tua casella per confermare.');
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2>🔄 Aggiorna email</h2>
      <input
        type="email"
        placeholder="Nuova email"
        value={nuovaEmail}
        onChange={(e) => setNuovaEmail(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
      />
      <button
        onClick={handleAggiornaEmail}
        disabled={!nuovaEmail || loading}
        style={{
          width: '100%',
          padding: '0.6rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Aggiorna email
      </button>
      {messaggio && <p style={{ marginTop: '1rem', color: messaggio.startsWith('✅') ? 'green' : 'red' }}>{messaggio}</p>}
    </div>
  );
};

export default AggiornaEmail;



