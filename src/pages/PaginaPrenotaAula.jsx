import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { supabase } from "../supabaseClient";
import messages from "../messages";

const PaginaPrenotaAula = () => {
  const { id } = useParams();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  const handlePrenota = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from('prenotazioni_corsi').insert([
      {
        corso_id: id,
        tipo: "aula",
        nome_utente: nome,
        email: email,
      },
    ]);

    if (error) {
      console.error("Errore prenotazione:", error);
      toast.error(messages.genericError);
    } else {
      toast.success(messages.courseBooked);
      setNome("");
      setEmail("");
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto border rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Prenota il Corso in Aula</h1>
        <p className="mb-4">Stai prenotando il corso con ID: <strong>{id}</strong></p>
        <form onSubmit={handlePrenota} className="flex flex-col gap-4">
          <input type="text" placeholder="Nome e Cognome" value={nome} onChange={(e) => setNome(e.target.value)} required className="border p-2 rounded" />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="border p-2 rounded" />
          <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded">Prenota</button>
        </form>
      </div>
    </div>
  );
};

export default PaginaPrenotaAula;

