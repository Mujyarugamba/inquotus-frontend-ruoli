import React from "react";
import CorsiSelezione from "../components/CorsiSelezione";

const Formazione = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">🎓 Catalogo Corsi di Formazione</h1>
      <p className="mb-6 text-gray-600">
        Seleziona un corso dall’elenco per visualizzare tutte le informazioni disponibili
        e inviare la tua richiesta.
      </p>
      <CorsiSelezione />
    </div>
  );
};

export default Formazione;
