// --- useAuth.js aggiornato ---

import { useState, useContext } from 'react';
import { supabase } from '../config/supabaseClient';
import { AuthContext } from '../context/AuthContext';

const useAuth = () => {
  const { setUtente } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = async (email, password, nome) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { nome }
        }
      });

      if (error) throw error;
      return true;
    } catch (err) {
      setError(err.message || 'Errore durante la registrazione');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      if (!email || !password) {
        throw new Error('Email e Password obbligatorie.');
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const token = data.session?.access_token;
      if (token) {
        localStorage.setItem('token', token);
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUtente({
          email: payload.email,
          nome: payload.user_metadata?.nome || '',
          ruolo: payload.app_metadata?.roles?.[0] || 'committente'
        });
        return true;
      }
      return false;
    } catch (err) {
      setError(err.message || 'Errore durante il login');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('token');
      setUtente(null);
    } catch (err) {
      setError(err.message || 'Errore durante il logout');
    } finally {
      setLoading(false);
    }
  };

  return { register, login, logout, loading, error };
};

export default useAuth;