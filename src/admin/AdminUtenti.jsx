import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Mail, Trash2 } from 'lucide-react';
import { Dialog } from '@headlessui/react';

const AdminUtenti = () => {
  const [utenti, setUtenti] = useState([]);
  const [filtroAttivo, setFiltroAttivo] = useState('tutti');
  const [filtroRuolo, setFiltroRuolo] = useState('tutti');
  const [search, setSearch] = useState('');
  const [utenteSelezionato, setUtenteSelezionato] = useState(null);
  const [isMailOpen, setIsMailOpen] = useState(false);
  const [mailData, setMailData] = useState({ subject: '', message: '' });

  const fetchUtenti = async () => {
    try {
      const res = await axios.get('/api/admin/utenti');
      setUtenti(res.data);
    } catch (err) {
      toast.error('Errore nel recupero utenti');
    }
  };

  useEffect(() => {
    fetchUtenti();
  }, []);

  const filtraUtenti = () => {
    return utenti.filter((u) => {
      const matchAttivo =
        filtroAttivo === 'tutti' ? true : filtroAttivo === 'attivi' ? u.attivo : !u.attivo;
      const matchRuolo = filtroRuolo === 'tutti' ? true : u.ruolo === filtroRuolo;
      const matchSearch =
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.nome.toLowerCase().includes(search.toLowerCase());
      return matchAttivo && matchRuolo && matchSearch;
    });
  };

  const toggleAttivo = async (utente) => {
    try {
      await axios.put(`/api/admin/utenti/${utente.id}/attivo`, { attivo: !utente.attivo });
      toast.success(`Utente ${utente.attivo ? 'disattivato' : 'attivato'}`);
      fetchUtenti();
    } catch {
      toast.error('Errore aggiornamento stato');
    }
  };

  const eliminaUtente = async (id) => {
    if (!window.confirm('Confermi l’eliminazione dell’utente?')) return;
    try {
      await axios.delete(`/api/admin/utenti/${id}`);
      toast.success('Utente eliminato');
      fetchUtenti();
    } catch {
      toast.error('Errore eliminazione');
    }
  };

  const inviaMail = async () => {
    try {
      await axios.post(`/api/admin/email/${utenteSelezionato.id}`, mailData);
      toast.success('Email inviata');
      setIsMailOpen(false);
    } catch {
      toast.error('Errore invio email');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">👥 Gestione utenti</h2>

      {/* FILTRI */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Cerca per email o nome"
          className="border px-3 py-2 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={filtroAttivo}
          onChange={(e) => setFiltroAttivo(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="tutti">Tutti</option>
          <option value="attivi">Attivi</option>
          <option value="disattivi">Disattivati</option>
        </select>
        <select
          value={filtroRuolo}
          onChange={(e) => setFiltroRuolo(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="tutti">Tutti i ruoli</option>
          <option value="committente">Committente</option>
          <option value="impresa">Impresa</option>
          <option value="professionista">Professionista</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* TABELLA */}
      <div className="overflow-x-auto">
        <table className="w-full border rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Nome</th>
              <th className="p-2">Ruolo</th>
              <th className="p-2">Attivo</th>
              <th className="p-2">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {filtraUtenti().map((utente) => (
              <tr key={utente.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{utente.email}</td>
                <td className="p-2">{utente.nome}</td>
                <td className="p-2 text-center capitalize">{utente.ruolo}</td>
                <td className="p-2 text-center">
                  <input
                    type="checkbox"
                    checked={utente.attivo}
                    onChange={() => toggleAttivo(utente)}
                  />
                </td>
                <td className="p-2 flex gap-3 justify-center">
                  <button onClick={() => { setUtenteSelezionato(utente); setIsMailOpen(true); }}>
                    <Mail size={18} />
                  </button>
                  <button onClick={() => eliminaUtente(utente.id)}>
                    <Trash2 size={18} className="text-red-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODALE EMAIL */}
      <Dialog open={isMailOpen} onClose={() => setIsMailOpen(false)} className="fixed z-50 inset-0 p-4">
        <div className="bg-white max-w-lg mx-auto rounded shadow p-6">
          <Dialog.Title className="text-xl font-bold mb-4">Invia email a {utenteSelezionato?.email}</Dialog.Title>
          <input
            type="text"
            placeholder="Oggetto"
            value={mailData.subject}
            onChange={(e) => setMailData({ ...mailData, subject: e.target.value })}
            className="w-full border px-3 py-2 rounded mb-3"
          />
          <textarea
            rows="5"
            placeholder="Messaggio"
            value={mailData.message}
            onChange={(e) => setMailData({ ...mailData, message: e.target.value })}
            className="w-full border px-3 py-2 rounded mb-3"
          />
          <div className="flex justify-end gap-3">
            <button onClick={() => setIsMailOpen(false)} className="text-gray-600 underline">Annulla</button>
            <button onClick={inviaMail} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Invia
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default AdminUtenti;


