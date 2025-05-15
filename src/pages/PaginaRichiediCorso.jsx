import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

const PaginaRichiediCorso = () => {
  const [searchParams] = useSearchParams();
  const corsoParam = searchParams.get("corso") || "";
  const modalitaParam = searchParams.get("modalita") || "";

  const [formData, setFormData] = useState({
    nome: "",
    azienda: "",
    email: "",
    telefono: "",
    corso: corsoParam,
    modalita: modalitaParam,
    note: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/inviaRichiesta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        const errorData = await response.json();
        alert("Errore invio richiesta: " + errorData.message);
      }
    } catch (error) {
      console.error("Errore invio richiesta:", error);
      alert("Errore nella richiesta. Riprova.");
    }
  };

  if (submitted) {
    return (
      <div className="p-6 max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-semibold mb-4">✅ Richiesta inviata con successo</h2>
        <p>Ti abbiamo inviato una mail di conferma. Il nostro staff ti contatterà al più presto per completare l'iscrizione al corso.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Richiesta Corso</h1>
      <p className="mb-6">Compila il modulo per richiedere informazioni o iscriverti al corso selezionato.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Nome e Cognome</label>
          <input name="nome" type="text" required value={formData.nome} onChange={handleChange} className="border p-2 w-full" />
        </div>
        <div>
          <label className="block mb-1">Azienda</label>
          <input name="azienda" type="text" value={formData.azienda} onChange={handleChange} className="border p-2 w-full" />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input name="email" type="email" required value={formData.email} onChange={handleChange} className="border p-2 w-full" />
        </div>
        <div>
          <label className="block mb-1">Telefono</label>
          <input name="telefono" type="text" required value={formData.telefono} onChange={handleChange} className="border p-2 w-full" />
        </div>
        <div>
          <label className="block mb-1">Corso richiesto</label>
          <input name="corso" type="text" value={formData.corso} readOnly className="border p-2 w-full bg-gray-100" />
        </div>
        <div>
          <label className="block mb-1">Modalità</label>
          <input name="modalita" type="text" value={formData.modalita} readOnly className="border p-2 w-full bg-gray-100" />
        </div>
        <div>
          <label className="block mb-1">Note aggiuntive</label>
          <textarea name="note" rows="3" value={formData.note} onChange={handleChange} className="border p-2 w-full" />
        </div>
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          Invia richiesta
        </button>
      </form>
    </div>
  );
};

export default PaginaRichiediCorso;

