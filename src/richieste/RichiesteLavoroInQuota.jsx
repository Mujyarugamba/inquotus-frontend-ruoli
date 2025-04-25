import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useRichiesteLavoroInQuota from '../hooks/useRichiesteLavoroInQuota';
import useSblocchiEffettuati from '../hooks/useSblocchiEffettuati';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SalvaButton from '../components/SalvaButton'; // ✅ nuovo import

const RichiesteLavoroInQuota = () => {
  const navigate = useNavigate();
  const [utente, setUtente] = useState(null);
  const [autorizzato, setAutorizzato] = useState(false);
  const [provinciaFiltro, setProvinciaFiltro] = useState('');
  const [soloSbloccate, setSoloSbloccate] = useState(false);

  const token = localStorage.getItem('token');
  const sblocchiEffettuati = useSblocchiEffettuati(token);
  const { richieste, loading } = useRichiesteLavoroInQuota(token, sblocchiEffettuati);

  useEffect(() => {
    if (!token) return;
    const payload = JSON.parse(atob(token.split('.')[1]));

    if (payload.ruolo === 'committente') {
      navigate('/mie-richieste');
      return;
    }

    setUtente(payload);
    setAutorizzato(true);
  }, [navigate, token]);

  if (!autorizzato) return null;

  const handleSblocca = async (richiestaId) => {
    if (!token) return toast.error('Devi essere loggato.');

    if (sblocchiEffettuati.includes(richiestaId)) {
      toast.info('Hai già sbloccato questa richiesta.');
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/api/checkout/sblocca`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ richiesta_id: richiestaId })
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error('Errore nella creazione del pagamento.');
      }
    } catch (err) {
      console.error('Errore nel pagamento:', err);
      toast.error('Errore durante il processo di pagamento.');
    }
  };

  const richiesteFiltrate = richieste.filter(r =>
    (provinciaFiltro === '' || r.provincia.toLowerCase().includes(provinciaFiltro.toLowerCase())) &&
    (!soloSbloccate || r.sbloccata === 'si')
  );

  return (
    <div style={{ padding: '1rem' }}>
      <h2>📢 Richieste di lavoro in quota</h2>

      <ToastContainer position="top-center" autoClose={3000} />

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Filtra per provincia (es. Milano)"
          value={provinciaFiltro}
          onChange={(e) => setProvinciaFiltro(e.target.value)}
          style={{ padding: '0.5rem', width: '100%', marginBottom: '0.5rem' }}
        />
        <label style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={soloSbloccate}
            onChange={(e) => setSoloSbloccate(e.target.checked)}
            style={{ marginRight: '0.5rem' }}
          />
          Mostra solo richieste sbloccate
        </label>
      </div>

      {loading ? (
        <p>⏳ Caricamento...</p>
      ) : richiesteFiltrate.length === 0 ? (
        <p>Nessuna richiesta trovata.</p>
      ) : (
        <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {richiesteFiltrate.map((r) => (
            <li
              key={r.id}
              style={{
                border: '1px solid #ccc',
                padding: '1rem',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                backgroundColor: '#fafafa'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p><strong>Categoria:</strong> {r.categoria}</p>
                {utente && <SalvaButton richiestaId={r.id} userId={utente.id} />}
              </div>
              <p><strong>Regione:</strong> {r.regione}</p>
              <p><strong>Provincia:</strong> {r.provincia}</p>
              <p><strong>Comune:</strong> {r.localita}</p>
              <p><strong>Descrizione:</strong> {r.descrizione.slice(0, 100)}...</p>
              <div style={{ marginTop: '0.3rem' }}>
                <strong>Contatti:</strong>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '0.2rem 0.6rem',
                    marginLeft: '0.5rem',
                    borderRadius: '12px',
                    backgroundColor: r.sbloccata === 'si' ? '#28a745' : '#ffc107',
                    color: '#fff',
                    fontSize: '0.75rem'
                  }}
                >
                  {r.sbloccata === 'si' ? 'Sbloccata' : 'Da sbloccare'}
                </span>
              </div>
              <button
                onClick={() =>
                  r.sbloccata === 'si'
                    ? navigate(`/richiesta/${r.id}`)
                    : handleSblocca(r.id)
                }
                style={{
                  marginTop: '0.5rem',
                  backgroundColor: r.sbloccata === 'si' ? 'gray' : '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  borderRadius: '5px'
                }}
              >
                {r.sbloccata === 'si' ? '👁️ Visualizza richiesta' : '🔓 Sblocca contatti'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RichiesteLavoroInQuota;
