import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchApi } from '../hooks/useApi'; // ✅ usa fetchApi, non useApi

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await fetchApi('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      localStorage.setItem('token', data.token);
      setMessage('✅ Accesso riuscito!');
      setTimeout(() => navigate('/home'), 1000);
    } catch (err) {
      setMessage(err.message || 'Errore durante il login');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2>Accedi</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <br /><br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <br /><br />
        <button type="submit">Accedi</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default Login;




