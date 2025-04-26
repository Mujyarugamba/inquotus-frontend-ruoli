import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';  // Importa il nostro hook personalizzato

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, error, loading } = useAuth();  // Usa il hook per registrazione
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(email, password);
    } catch (err) {
      setMessage(error || 'Errore durante la registrazione');
    }
  };

  return (
    <div>
      <h2>Registrati</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Password"
        />
        <button type="submit" disabled={loading}>Registrati</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;

