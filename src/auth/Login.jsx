import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../config/config';
import { AuthContext } from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checkingToken, setCheckingToken] = useState(true);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        switch (payload.ruolo) {
          case 'committente':
            navigate('/home');
            break;
          case 'impresa':
            navigate('/impresa');
            break;
          case 'professionista':
            navigate('/professionista');
            break;
          default:
            navigate('/');
        }
      } catch (err) {
        console.error('Errore parsing token:', err);
        localStorage.removeItem('token');
      }
    }
    setCheckingToken(false);
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || '❌ Login fallito');
        return;
      }

      login(data.token, data.ruolo);
      toast.success('✅ Login riuscito!');
      setEmail('');
      setPassword('');

      setTimeout(() => {
        switch (data.ruolo) {
          case 'committente':
            navigate('/home');
            break;
          case 'impresa':
            navigate('/impresa');
            break;
          case 'professionista':
            navigate('/professionista');
            break;
          default:
            navigate('/');
        }
      }, 1500);
    } catch (err) {
      toast.error('❌ Errore di connessione al server');
    }
  };

  if (checkingToken) return null;

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: 'block', marginBottom: '1rem', width: '100%' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: 'block', marginBottom: '1rem', width: '100%' }}
        />
        <button type="submit">Accedi</button>
      </form>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default Login;



