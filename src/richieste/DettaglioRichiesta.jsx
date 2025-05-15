import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE } from '../config';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';

const DettaglioRichiesta = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [richiesta, setRichiesta] = useState(null);
  const [caricamento, setCaricamento] = useState(true);
  const [sbloccata, setSbloccata] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchRichiesta = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/richieste-lavoro-in-quota/${slug}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setRichiesta(data);
      } catch {
        toast.error("Richiesta non trovata");
        navigate("/richieste");
      } finally {
        setCaricamento(false);
      }
    };
    fetchRichiesta();
  }, [slug, navigate]);

  useEffect(() => {
    const checkSblocco = async () => {
      if (!token || !richiesta) return;
      try {
        const res = await fetch(`${API_BASE}/api/sblocchi-effettuati`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (Array.isArray(data) && data.includes(richiesta.id)) {
          setSbloccata(true);
        }
      } catch {
        console.error('Errore controllo sblocco');
      }
    };
    checkSblocco();
  }, [token, richiesta]);

  const handleSbloccaContatti = async () => {
    if (!token) {
      toast.error("Devi accedere per sbloccare i contatti.");
      navigate("/login");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/checkout/sblocca`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ richiesta_id: richiesta.id })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Errore durante il pagamento");
      }
    } catch {
      toast.error("Errore nella richiesta di sblocco");
    }
  };

  if (caricamento) return <div className="p-6">⏳ Caricamento...</div>;

  if (!richiesta) return null;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <Helmet>
        <title>{richiesta.titolo} – Inquotus</title>
        <meta name="description" content={`Richiesta per ${richiesta.categoria} a ${richiesta.localita}`} />
      </Helmet>

      <h2 className="text-2xl font-bold mb-2">{richiesta.titolo}</h2>
      <p className="text-gray-600 mb-1">📍 {richiesta.localita}</p>
      <p className="text-gray-600 mb-1">🗂 {richiesta.categoria}</p>
      {richiesta.urgente && (
        <p className="inline-block bg-red-500 text-white text-xs px-2 py-1 rounded mb-2">🚨 Urgente</p>
      )}

      {richiesta.media_url && (
        <div className="my-4">
          <img src={richiesta.media_url} alt="Allegato" className="max-h-64 rounded shadow" />
        </div>
      )}

      <p className="text-gray-800 mb-4 whitespace-pre-wrap">{richiesta.descrizione || 'Nessuna descrizione.'}</p>

      {sbloccata ? (
        <div className="p-4 border rounded bg-green-50">
          <p className="text-sm text-gray-700 mb-1">📞 Contatti:</p>
          <p className="text-lg font-semibold text-blue-700">{richiesta.contatti}</p>
        </div>
      ) : (
        <button
          onClick={handleSbloccaContatti}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          🔓 Sblocca contatti
        </button>
      )}

      <div className="mt-6">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-600 underline hover:text-blue-700"
        >
          ← Torna indietro
        </button>
      </div>
    </div>
  );
};

export default DettaglioRichiesta;



