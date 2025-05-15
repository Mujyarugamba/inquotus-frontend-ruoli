// --- ResetPasswordSupabase.jsx aggiornato ---

import React, { useState } from 'react';
import supabase from '../config/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const ResetPasswordSupabase = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    if (!password) {
      toast.error('Inserisci la nuova password!');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        toast.error('❌ Errore: ' + error.message);
      } else {
        toast.success('✅ Password aggiornata con successo!');
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(() => navigate('/login'), 1000);
        }, 1500);
      }
    } catch (err) {
      toast.error('❌ Errore durante l\'aggiornamento della password');
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
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Imposta nuova password</h2>
            <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                type="password"
                placeholder="Nuova password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                  '🔐 Aggiorna password'
                )}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
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

export default ResetPasswordSupabase;


