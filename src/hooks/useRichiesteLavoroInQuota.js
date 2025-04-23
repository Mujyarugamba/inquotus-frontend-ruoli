import { useEffect, useState } from 'react';
import { API_BASE } from '../config/config';

const useRichiesteLavoroInQuota = (token, sblocchiEffettuati) => {
  const [richieste, setRichieste] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRichieste = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/richieste/pubbliche`);
        const data = await res.json();

        const richiesteTaggate = data.map(r => ({
          ...r,
          sbloccata: sblocchiEffettuati.includes(r.id) ? 'si' : 'no'
        }));

        setRichieste(richiesteTaggate);
      } catch (err) {
        console.error('Errore nel fetch delle richieste:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchRichieste();
  }, [token, sblocchiEffettuati]);

  return { richieste, loading };
};

export default useRichiesteLavoroInQuota;



