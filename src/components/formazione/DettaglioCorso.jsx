import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient"; 
import { toast } from "react-toastify"; 
import messages from "../../messages";

const DettaglioCorso = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [corso, setCorso] = useState(null);

  useEffect(() => {
    fetchCorso();
  }, [id]);

  const fetchCorso = async () => {
    const { data, error } = await supabase
      .from("corsi_formazione")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Errore fetch dettaglio corso:", error);
      toast.error(messages.dataLoadError);
    } else {
      setCorso(data);
    }
  };

  const handleNavigate = (tipo) => {
    navigate(`/formazione/${tipo}/${id}`);
  };

  if (!corso) {
    return <div className="p-4">{messages.dataLoadError}</div>;
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto border rounded-lg shadow p-6">
        <img src={corso.immagine} alt={corso.titolo} className="w-full h-64 object-cover mb-4 rounded" />
        <h1 className="text-3xl font-bold mb-2">{corso.titolo}</h1>
        <p className="text-gray-700 mb-4">{corso.descrizione}</p>
        
        <p className="text-sm text-gray-500 mb-2">Durata: {corso.durata} ore</p>
        <p className="text-sm text-gray-500 mb-4">Certificazione: {corso.certificazione_rilasciata}</p>

        <div className="flex flex-wrap gap-4 mt-4">
          {corso.modalità_fad && (
            <button
              onClick={() => handleNavigate('fad')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Segui Online (da {corso.prezzo_fad}€)
            </button>
          )}
          {corso.modalità_aula && (
            <button
              onClick={() => handleNavigate('aula')}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              Prenota in Aula (da {corso.prezzo_aula}€)
            </button>
          )}
          {corso.modalità_azienda && (
            <button
              onClick={() => handleNavigate('azienda')}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
            >
              Corso in Azienda (da {corso.prezzo_azienda}€)
            </button>
          )}
        </div>

        {corso.sedi_disponibili?.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Sedi Disponibili:</h2>
            <ul className="list-disc list-inside">
              {corso.sedi_disponibili.map((sede, index) => (
                <li key={index}>{sede}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Programma del Corso:</h2>
          <p className="text-gray-700 whitespace-pre-line">{corso.programma}</p>
        </div>
      </div>
    </div>
  );
};

export default DettaglioCorso;


