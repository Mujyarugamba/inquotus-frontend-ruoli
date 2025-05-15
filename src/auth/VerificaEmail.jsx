// --- VerificaEmail.jsx ---

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const VerificaEmail = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div style={containerStyle}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={cardStyle}
      >
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#333' }}>📧 Controlla la tua email</h1>
        <p style={{ marginBottom: '2rem', fontSize: '1.1rem', color: '#555' }}>
          Ti abbiamo inviato un'email di conferma. <br />
          Clicca sul link ricevuto per attivare il tuo account su <b>Inquotus</b>!
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLoginRedirect}
          style={buttonStyle}
        >
          🔐 Vai al Login
        </motion.button>
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
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
};

const cardStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.85)',
  padding: '3rem 2rem',
  borderRadius: '1rem',
  boxShadow: '0px 10px 30px rgba(0,0,0,0.2)',
  textAlign: 'center',
  maxWidth: '400px',
  width: '100%',
};

const buttonStyle = {
  padding: '0.8rem 1.2rem',
  fontSize: '1rem',
  backgroundColor: '#667eea',
  color: 'white',
  border: 'none',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  fontWeight: 'bold',
};

export default VerificaEmail;



