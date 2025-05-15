// --- useAuth.js aggiornato con messaggi centralizzati ---

import { useState, useContext } from 'react';
import  supabase  from '../config/supabaseClient';
import { AuthContext } from '../context/AuthContext';
import messages from '../utils/messages'; // <-- Importato messaggi

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
      if (err.message.includes('429')) {
        setError(messages.error.networkError); // Troppi tentativi → network error amichevole
      } else if (err.message.includes('Invalid email')) {
        setError(messages.error.registrationFailed); // Email non valida → messaggio di registrazione
      } else {
        setError(messages.error.registrationFailed); // Qualsiasi altro errore
      }
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
        throw new Error(messages.error.loginFailed);
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
      if (err.message.includes('Invalid login credentials')) {
        setError(messages.error.loginFailed); // Credenziali sbagliate
      } else if (err.message.includes('Email not confirmed')) {
        setError(messages.error.unauthorizedAccess); // Email non confermata
      } else {
        setError(messages.error.networkError); // Problema di accesso generico
      }
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
      setError(messages.error.networkError); // errore durante logout
    } finally {
      setLoading(false);
    }
  };

  return { register, login, logout, loading, error };
};

export default useAuth;

