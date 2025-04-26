import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth'; // Assicurati che il percorso sia corretto

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      setMessage('✅ Accesso riuscito!');
      setTimeout(() => navigate('/home'), 1000);
    } catch (err) {
      setMessage(err.message || 'Errore durante il login');
    }
  };

  const handleResetPassword = async () => {
    if (!form.email) {
      setMessage('⚠️ Inserisci prima l\'email.');
      return;
    }
    try {
      await resetPassword(form.email);
      setMessage('✅ Email inviata per il reset della password.');
    } catch (err) {
      setMessage(err.message || 'Errore durante il reset della password');
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
          type={showPassword ? 'text' : 'password'}
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
      <button onClick={handleResetPassword}>Reset Password</button>
    </div>
  );
};

export default Login;





