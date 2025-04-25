import { useEffect, useState } from 'react';
import { API_BASE } from '../config';

const useSblocchiEffettuati = (token) => {
  const [sblocchi, setSblocchi] = useState([]);

  useEffect(() => {
    if (!token) return;

    const fetchSblocchi = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/sblocchi-effettuati`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setSblocchi(data.map(r => r.id));
      } catch (err) {
        console.error('Errore fetch sblocchi:', err);
      }
    };

    fetchSblocchi();
  }, [token]);

  return sblocchi;
};

export default useSblocchiEffettuati;

