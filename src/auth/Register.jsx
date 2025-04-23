import React, { useState } from 'react';
import { API_BASE } from '../config/config';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    password: '',
    ruolo: 'committente'
  });
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validazione password
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&]).{6,}$/;
    if (!regex.test(form.password)) {
      setMessage('⚠️ La password deve contenere almeno 6 caratteri, una maiuscola, una minuscola, un numero e un simbolo');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Registrazione completata!');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setMessage(data.error || 'Errore durante la registrazione');
      }
    } catch (err) {
      console.error('Errore connessione:', err);
      setMessage('Errore di connessione al server');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2>Registrati</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nome"
          placeholder="Nome completo"
          value={form.nome}
          onChange={handleChange}
          required
        /><br /><br />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        /><br /><br />

        <div style={{ position: 'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            style={{ paddingRight: '2.5rem' }}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer'
            }}
          >
            {showPassword ? '🙈' : '👁️'}
          </span>
        </div><br />

        <select name="ruolo" value={form.ruolo} onChange={handleChange} required>
          <option value="committente">Committente</option>
          <option value="impresa">Impresa</option>
          <option value="professionista">Professionista</option>
        </select><br /><br />

        <button type="submit">Registrati</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default Register;


