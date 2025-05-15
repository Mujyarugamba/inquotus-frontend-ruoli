import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CorsiSelezione = () => {
  const [corsi, setCorsi] = useState([]);
  const [corsoSelezionato, setCorsoSelezionato] = useState(null);
  const [errore, setErrore] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCorsi = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/corsi');
        if (!response.ok) {
          throw new Error('Errore nella risposta del server');
        }
        const data = await response.json();
        console.log('Corsi ricevuti:', data);
        setCorsi(data);
      } catch (error) {
        console.error('Errore nel recupero dei corsi:', error);
        setErrore('Impossibile recuperare i corsi. Riprova più tardi.');
      }
    };

    fetchCorsi();
  }, []);

  const handleChange = (e) => {
    const id = parseInt(e.target.value);
    const corso = corsi.find((c) => c.id === id);
    setCorsoSelezionato(corso);
    console.log('Corso selezionato:', corso);
  };

  const vaiAIscrizione = () => {
    if (corsoSelezionato) {
      navigate(
        `/richiedi-corso?corso=${encodeURIComponent(corsoSelezionato.titolo)}&modalita=${encodeURIComponent(
          corsoSelezionato.modalita
        )}`
      );
    }
  };

  return (
    <div>
      <div className="mb-6">
        <label className="block mb-2 font-semibold">Seleziona un corso:</label>
        <select onChange={handleChange} className="border p-2 w-full max-w-md">
          <option value="">-- Seleziona --</option>
          {corsi.map((corso) => (
            <option key={corso.id} value={corso.id}>
              {corso.titolo} ({corso.modalita})
            </option>
          ))}
        </select>

        {errore && <p className="text-red-500 mt-2">{errore}</p>}
        {!errore && corsi.length === 0 && (
          <p className="text-gray-500 mt-2">⏳ Nessun corso disponibile al momento.</p>
        )}
      </div>

      {corsoSelezionato && (
        <div className="border p-4 rounded bg-gray-50 shadow-sm">
          <h2 className="text-xl font-bold mb-2">{corsoSelezionato.titolo}</h2>
          <p className="mb-1"><strong>Modalità:</strong> {corsoSelezionato.modalita}</p>
          <p className="mb-1"><strong>Durata:</strong> {corsoSelezionato.durata}</p>
          <p className="mb-1"><strong>Prezzo:</strong> €{corsoSelezionato.prezzo}</p>
          <p className="mb-1"><strong>Luogo:</strong> {corsoSelezionato.luogo || 'n.d.'}</p>
          <p className="mb-1"><strong>Data evento:</strong> {corsoSelezionato.data_evento || 'n.d.'}</p>
          <p className="mb-1"><strong>Descrizione:</strong> {corsoSelezionato.descrizione}</p>
          <p className="mb-1"><strong>Requisiti:</strong> {corsoSelezionato.requisiti || 'Nessuno'}</p>
          <p className="mb-4"><strong>Certificazione:</strong> {corsoSelezionato.certificazione || 'n.d.'}</p>
          <button
            onClick={vaiAIscrizione}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Richiedi questo corso
          </button>
        </div>
      )}
    </div>
  );
};

export default CorsiSelezione;



