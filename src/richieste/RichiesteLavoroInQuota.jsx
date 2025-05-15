import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useRichiesteLavoroInQuota from '../hooks/useRichiesteLavoroInQuota';
import useSblocchiEffettuati from '../hooks/useSblocchiEffettuati';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SalvaButton from '../components/SalvaButton';
import messages from '../utils/messages';

const RichiesteLavoroInQuota = () => {
  const navigate = useNavigate();
  const [utente, setUtente] = useState(null);
  const [autorizzato, setAutorizzato] = useState(false);
  const [provinciaFiltro, setProvinciaFiltro] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
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

  const handleSblocca = async (richiestaId) => {
    if (!token) {
      toast.error(messages.error.unauthorizedAccess);
      return;
    }

    if (sblocchiEffettuati.includes(richiestaId)) {
      toast.info(messages.info.noOffersYet);
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
        toast.error(messages.error.paymentFailed);
      }
    } catch {
      toast.error("Errore durante lo sblocco");
    }
  };

  if (!autorizzato) return null;

  const richiesteFiltrate = richieste.filter((r) => {
    const matchProvincia = provinciaFiltro ? r.localita?.includes(provinciaFiltro) : true;
    const matchCategoria = categoriaFiltro ? r.categoria === categoriaFiltro : true;
    const matchSblocco = soloSbloccate ? sblocchiEffettuati.includes(r.id) : true;
    return matchProvincia && matchCategoria && matchSblocco;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-gray-800 mb-6">🧗 Richieste di lavori in quota</h1>

      {/* FILTRI */}
      <div className="bg-white rounded shadow p-4 mb-6 flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="📍 Filtra per provincia"
          className="border border-gray-300 px-3 py-2 rounded w-full md:w-60"
          value={provinciaFiltro}
          onChange={(e) => setProvinciaFiltro(e.target.value)}
        />
        <select
          className="border border-gray-300 px-3 py-2 rounded w-full md:w-60"
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value)}
        >
          <option value="">🗂 Tutte le categorie</option>
          <option value="Pulizia tetti">Pulizia tetti</option>
          <option value="Ispezione facciate">Ispezione facciate</option>
          <option value="Taglio alberi">Taglio alberi</option>
          <option value="Installazione antenne">Installazione antenne</option>
          <option value="Manutenzione grondaie">Manutenzione grondaie</option>
          <option value="Altro">Altro</option>
        </select>
        <label className="flex items-center space-x-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={soloSbloccate}
            onChange={(e) => setSoloSbloccate(e.target.checked)}
          />
          <span>Solo richieste sbloccate</span>
        </label>
      </div>

      {loading ? (
        <p>⏳ Caricamento richieste...</p>
      ) : richiesteFiltrate.length === 0 ? (
        <p className="text-gray-500">❌ Nessuna richiesta trovata.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {richiesteFiltrate.map((r) => (
            <div key={r.id} className="bg-white border rounded-lg shadow-sm p-5 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-gray-800">{r.titolo}</h3>
                {r.urgente && (
                  <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">
                    Urgente
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-1">📍 {r.localita}</p>
              <p className="text-sm text-gray-600 mb-2">🗂 {r.categoria}</p>

              {sblocchiEffettuati.includes(r.id) && (
                <div className="mb-2">
                  <span className="inline-block bg-green-500 text-white text-xs px-2 py-1 rounded">
                    ✅ Contatti sbloccati
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => navigate(`/richiesta/${r.slug}`)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  📄 Dettagli
                </button>
                <SalvaButton richiestaId={r.id} />
              </div>

              {!sblocchiEffettuati.includes(r.id) && (
                <button
                  onClick={() => handleSblocca(r.id)}
                  className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded transition"
                >
                  🔓 Sblocca contatti
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RichiesteLavoroInQuota;
