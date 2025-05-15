import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const navigate = useNavigate();
  const { utente } = useAuth();

  // ⛔ Redirige subito se utente già autenticato
  if (utente) {
    return <Navigate to={`/${utente.ruolo}`} replace />;
  }

  return (
    <div style={containerStyle}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={cardStyle}
      >
        <h1 style={{ marginBottom: '1rem' }}>Benvenuto su Inquotus</h1>
        <p style={{ marginBottom: '2rem' }}>Scegli chi sei per iniziare:</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button style={buttonStyle} onClick={() => navigate('/register?role=committente')}>
            Sono un Committente
          </button>
          <button style={buttonStyle} onClick={() => navigate('/register?role=impresa')}>
            Sono un'Impresa
          </button>
          <button style={buttonStyle} onClick={() => navigate('/register?role=professionista')}>
            Sono un Professionista
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: '2rem',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)'
};

const cardStyle = {
  backgroundColor: 'rgba(255,255,255,0.9)',
  padding: '3rem',
  borderRadius: '1rem',
  boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
  textAlign: 'center',
  maxWidth: '400px',
  width: '100%'
};

const buttonStyle = {
  padding: '0.8rem',
  fontSize: '1rem',
  borderRadius: '0.5rem',
  border: 'none',
  backgroundColor: '#667eea',
  color: 'white',
  fontWeight: 'bold',
  cursor: 'pointer'
};

export default Landing;

