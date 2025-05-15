import { useEffect, useState } from 'react';
import { API_BASE } from '../config';

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
          sbloccata: sblocchiEffettuati.includes(r.id) ? 'si' : 'no',
          slug: r.slug // ✅ aggiunto in modo sicuro
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




