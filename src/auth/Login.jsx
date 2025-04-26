import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';  // Importa il nostro hook personalizzato

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, loading } = useAuth();  // Usa il hook per login
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      setMessage(error || 'Errore durante il login');
    }
  };

  return (
    <div>
      <h2>Accedi</h2>
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
        <button type="submit" disabled={loading}>Accedi</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;




