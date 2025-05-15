import React, { useEffect, useState } from 'react';
import { API_BASE } from '../config';
import { toast } from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';
import { logoutAutomatico } from '../hooks/useAuth'; // 👈 IMPORT logoutAutomatico

const SblocchiEffettuati = () => {
  const [sblocchi, setSblocchi] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSblocchi = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/api/sblocchi-effettuati`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.status === 401) {
          logoutAutomatico();
          return;
        }
        const data = await res.json();
        setSblocchi(data);
        toast.success('✅ Sblocchi caricati con successo!');
      } catch (err) {
        console.error("Errore nel caricamento degli sblocchi:", err);
        toast.error('❌ Errore durante il caricamento degli sblocchi.');
      } finally {
        setLoading(false);
      }
    };

    fetchSblocchi();
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>📁 Storico sblocchi</h2>
      <p>Visualizza tutte le richieste di lavoro in quota che hai già sbloccato.</p>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
          <ClipLoader color="#667eea" size={50} />
        </div>
      ) : sblocchi.length === 0 ? (
        <p>Nessuno sblocco effettuato finora.</p>
      ) : (
        <ul>
          {sblocchi.map((r) => (
            <li
              key={r.id}
              style={{
                marginBottom: '1rem',
                border: '1px solid #ccc',
                padding: '1rem',
                borderRadius: '8px',
                background: '#f9f9f9'
              }}
            >
              <p><strong>Categoria:</strong> {r.categoria}</p>
              <p><strong>Comune:</strong> {r.localita}</p>
              <p><strong>Data richiesta:</strong> {new Date(r.data_inserimento).toLocaleDateString()}</p>
              <p><strong>Data sblocco:</strong> {new Date(r.data_sblocco).toLocaleDateString()}</p>
              <p><strong>Contatto:</strong> {r.nome_committente}</p>
              <p><strong>Email:</strong> {r.email}</p>
              <p><strong>Telefono:</strong> {r.telefono}</p>
              <p><strong>Descrizione:</strong> {r.descrizione}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SblocchiEffettuati;
