import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Particles } from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';

const Errore404 = () => {
  const navigate = useNavigate();

  const particlesInit = async (main) => {
    await loadSlim(main);
  };

  return (
    <div style={containerStyle}>
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}
      />
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={cardStyle}
      >
        <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>404</h1>
        <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Pagina non trovata.</p>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          style={buttonStyle}
        >
          Torna alla Home
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
  position: 'relative',
  overflow: 'hidden',
  padding: '2rem'
};

const cardStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.75)',
  padding: '3rem',
  borderRadius: '1rem',
  boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
  textAlign: 'center',
  zIndex: 1
};

const buttonStyle = {
  padding: '0.8rem 2rem',
  backgroundColor: '#667eea',
  color: 'white',
  fontWeight: 'bold',
  fontSize: '1.1rem',
  border: 'none',
  borderRadius: '0.5rem',
  cursor: 'pointer'
};

const particlesOptions = {
  fullScreen: { enable: false },
  particles: {
    number: { value: 80, density: { enable: true, area: 800 } },
    color: { value: '#ffffff' },
    shape: { type: 'circle' },
    opacity: { value: 0.3, random: true },
    size: { value: { min: 1, max: 4 }, random: true },
    move: { enable: true, speed: 1, direction: 'top', straight: false },
    links: { enable: false },
  },
  interactivity: {
    events: { onHover: { enable: false }, onClick: { enable: false } },
  },
  background: {
    color: 'transparent'
  }
};

export default Errore404;


