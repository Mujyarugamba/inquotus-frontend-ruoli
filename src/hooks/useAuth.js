import { useState } from 'react';
import { supabase } from '../config/supabaseClient'; // Assicurati che il percorso sia corretto

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Funzione per gestire il login
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { user, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      setUser(user);
    } catch (err) {
      setError(err.message || 'Errore durante il login');
    } finally {
      setLoading(false);
    }
  };

  // Funzione per gestire il logout
  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (err) {
      setError(err.message || 'Errore durante il logout');
    } finally {
      setLoading(false);
    }
  };

  // Funzione per il reset della password
  const resetPassword = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.api
        .resetPasswordForEmail(email);
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err.message || 'Errore durante il reset della password');
    } finally {
      setLoading(false);
    }
  };

  // Funzione per ottenere i dettagli dell'utente
  const getUser = async () => {
    const currentUser = supabase.auth.user();
    setUser(currentUser);
    return currentUser;
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    resetPassword, // Esportiamo la funzione di reset della password
    getUser,
  };
};

export default useAuth;
