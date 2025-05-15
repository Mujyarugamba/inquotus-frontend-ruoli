import React, { createContext, useState, useEffect, useContext } from 'react';
import supabase from '../config/supabaseClient';

export const AuthContext = createContext();

const VALID_ROLES = ['committente', 'impresa', 'professionista', 'admin']; // Ruoli validi

export const AuthProvider = ({ children }) => {
  const [utente, setUtente] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  const handleUserStateChange = async (user) => {
    if (user) {
      try {
        const { email, user_metadata } = user;

        const ruolo = user_metadata?.ruolo; // Ruolo estratto dai metadata dell'utente
        const nome = user_metadata?.nome || 'Utente';

        if (!ruolo || !VALID_ROLES.includes(ruolo)) {
          console.error("Errore: Ruolo non valido:", ruolo);
          throw new Error('Accesso negato: Ruolo non valido');
        }

        setUtente({ email, nome, ruolo });
        localStorage.setItem('utente', JSON.stringify({ email, nome, ruolo }));
      } catch (err) {
        console.error("Errore durante la gestione dello stato utente:", err.message);
        setUtente(null);
        localStorage.removeItem('utente');
      }
    } else {
      setUtente(null);
      localStorage.removeItem('utente');
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      console.log("Tentativo di login con:", email);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const user = data.user;
      if (user) {
        await handleUserStateChange(user);
        return { success: true };
      }

      return { success: false, message: 'Utente non trovato' };
    } catch (err) {
      console.error("Errore durante il login:", err.message);
      setError(err.message || 'Errore durante il login');
      setUtente(null); // Resetta lo stato dell'utente
      return { success: false, message: err.message || 'Errore durante il login' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('utente');
      setUtente(null);
    } catch (err) {
      console.error('Errore durante il logout:', err);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        const storedUser = localStorage.getItem('utente');
        if (storedUser) {
          // Imposta l'utente dallo stato locale
          setUtente(JSON.parse(storedUser));
        } else {
          // Recupera l'utente dal server
          const { data, error } = await supabase.auth.getUser();
          if (error) {
            console.error("Errore durante il recupero dell'utente:", error.message);
            setUtente(null);
          } else if (data?.user) {
            await handleUserStateChange(data.user);
          }
        }
      } catch (err) {
        console.error("Errore durante il controllo dell'utente:", err.message);
        setUtente(null);
      } finally {
        setInitializing(false);
      }
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      handleUserStateChange(session?.user);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ utente, setUtente, login, logout, loading, error, initializing }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);