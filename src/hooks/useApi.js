import { API_BASE } from '../config.js'; // ← estensione .js necessaria su Vercel

export const useApi = () => {
  const fetchApi = async (endpoint, options = {}) => {
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, options);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Errore di rete');
      return data;
    } catch (err) {
      console.error('Errore API:', err.message);
      throw err;
    }
  };

  return { fetchApi };
};
