import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const MagicLinkLogin = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleMagicLink = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: 'http://localhost:3000/login'
      }
    });

    if (error) {
      setMessage('❌ Errore: ' + error.message);
    } else {
      setMessage('📩 Controlla la tua email per il magic link!');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2>Login con Magic Link</h2>
      <form onSubmit={handleMagicLink}>
        <input
          type="email"
          placeholder="Inserisci la tua email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
        />
        <button type="submit">📬 Invia Magic Link</button>
      </form>
      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  );
};

export default MagicLinkLogin;



