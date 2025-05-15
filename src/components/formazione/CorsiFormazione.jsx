// src/components/formazione/CorsiFormazione.jsx

import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient"; // Percorso corretto
import { toast } from "react-toastify"; // Per notifiche
import messages from "../../messages"; // Import messaggi

const CorsiFormazione = () => {
  const [corsi, setCorsi] = useState([]);

  useEffect(() => {
    fetchCorsi();
  }, []);

  const fetchCorsi = async () => {
    const { data, error } = await supabase.from("corsi_formazione").select("*");
    if (error) {
      console.error("Errore fetch corsi:", error);
      toast.error(messages.dataLoadError);
    } else {
      setCorsi(data);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Corsi di Formazione</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {corsi.map((corso) => (
          <div key={corso.id} className="border rounded-lg p-4 shadow">
            <img src={corso.immagine} alt={corso.titolo} className="w-full h-40 object-cover mb-2" />
            <h2 className="text-xl font-semibold">{corso.titolo}</h2>
            <p className="text-sm">{corso.durata} ore</p>
            <div className="mt-2">
              {corso.modalità_fad && <button className="bg-blue-500 text-white px-2 py-1 mr-2 rounded">FAD</button>}
              {corso.modalità_aula && <button className="bg-green-500 text-white px-2 py-1 mr-2 rounded">Aula</button>}
              {corso.modalità_azienda && <button className="bg-yellow-500 text-white px-2 py-1 rounded">Azienda</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CorsiFormazione;
