import React, { useState } from 'react';
import supabase from '../config/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import messages from '../utils/messages'; // <-- Importato messaggi centralizzati

const MagicLinkLogin = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();

  const handleMagicLink = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error(messages.error.loginFailed); // 📧 Usa messaggio centralizzato
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: process.env.REACT_APP_REDIRECT_URL } // <-- Qui leggiamo l'URL corretto da .env.local
      });

      if (error) {
        toast.error(messages.error.networkError); // ❌ Messaggio centralizzato
      } else {
        toast.success(messages.info.documentVerification); // 📩 Messaggio di invio email
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(() => navigate('/login'), 1000);
        }, 1500);
      }
    } catch (err) {
      toast.error(messages.error.networkError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {!fadeOut && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={containerStyle}
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={cardStyle}
          >
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Accedi con Magic Link</h2>
            <form onSubmit={handleMagicLink} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                type="email"
                placeholder="Inserisci la tua email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                style={inputStyle}
              />
              <motion.button
                type="submit"
                disabled={loading}
                style={buttonStyle}
                whileHover={!loading ? { scale: 1.05 } : {}}
                animate={loading ? { width: 70 } : { width: '100%' }}
                transition={{ duration: 0.3 }}
              >
                {loading ? (
                  <motion.div
                    style={{ height: 4, width: '100%', backgroundColor: '#ffffff', borderRadius: 2 }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut' }}
                  />
                ) : (
                  'Invia Magic Link'
                )}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// STILI
const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: '2rem',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
};

const cardStyle = {
  backgroundColor: 'rgba(255,255,255,0.8)',
  padding: '2rem',
  borderRadius: '1rem',
  boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
  width: '100%',
  maxWidth: '400px'
};

const inputStyle = {
  padding: '0.8rem 1rem',
  borderRadius: '0.5rem',
  border: '1px solid #ccc',
  fontSize: '1rem',
  width: '100%'
};

const buttonStyle = {
  padding: '0.8rem 1rem',
  backgroundColor: '#667eea',
  color: 'white',
  fontWeight: 'bold',
  fontSize: '1rem',
  border: 'none',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

export default MagicLinkLogin;




