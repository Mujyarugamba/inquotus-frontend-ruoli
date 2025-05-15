import React, { useEffect, useState } from 'react';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { toast } from 'react-hot-toast';
import { Pencil, Trash2 } from 'lucide-react';

const AdminRichiesteLavoro = () => {
  const [richieste, setRichieste] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroProvincia, setFiltroProvincia] = useState('');
  const [filtroData, setFiltroData] = useState('');
  const [filtroTesto, setFiltroTesto] = useState('');
  const [soloSospette, setSoloSospette] = useState(false);

  const fetchRichieste = async () => {
    try {
      const res = await fetch('/api/admin/richieste-lavoro');
      const data = await res.json();
      setRichieste(data);
    } catch {
      toast.error('Errore nel caricamento richieste');
    }
  };

  useEffect(() => {
    fetchRichieste();
  }, []);

  const isSospetta = (descrizione) => /test|prova|fake|ciao/i.test(descrizione || '');

  const handleElimina = async (id) => {
    if (!window.confirm('Confermi l’eliminazione della richiesta?')) return;
    try {
      const res = await fetch(`/api/admin/richieste-lavoro/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('Richiesta eliminata');
        fetchRichieste();
      } else {
        throw new Error();
      }
    } catch {
      toast.error('Errore durante l’eliminazione');
    }
  };

  const richiesteFiltrate = richieste.filter((r) => {
    const matchCat = filtroCategoria ? r.categoria?.includes(filtroCategoria) : true;
    const matchProv = filtroProvincia ? r.localita?.includes(filtroProvincia) : true;
    const matchData = filtroData ? r.data_inserimento?.startsWith(filtroData) : true;
    const matchTesto = filtroTesto
      ? (r.descrizione || '').toLowerCase().includes(filtroTesto.toLowerCase())
      : true;
    const matchSospette = soloSospette ? isSospetta(r.descrizione) : true;
    return matchCat && matchProv && matchData && matchTesto && matchSospette;
  });

  const esportaCSV = () => {
    const csv = Papa.unparse(richiesteFiltrate);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'richieste_lavoro.csv');
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">🗂 Gestione richieste lavoro</h2>

      {/* FILTRI */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Categoria"
          className="border px-3 py-2 rounded"
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
        />
        <input
          type="text"
          placeholder="Provincia"
          className="border px-3 py-2 rounded"
          value={filtroProvincia}
          onChange={(e) => setFiltroProvincia(e.target.value)}
        />
        <input
          type="date"
          className="border px-3 py-2 rounded"
          value={filtroData}
          onChange={(e) => setFiltroData(e.target.value)}
        />
        <input
          type="text"
          placeholder="Testo descrizione"
          className="border px-3 py-2 rounded"
          value={filtroTesto}
          onChange={(e) => setFiltroTesto(e.target.value)}
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={soloSospette}
            onChange={(e) => setSoloSospette(e.target.checked)}
          />
          Solo sospette
        </label>
        <button
          onClick={esportaCSV}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          📤 Esporta CSV
        </button>
      </div>

      {/* TABELLA */}
      <div className="overflow-x-auto">
        <table className="w-full border rounded text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Titolo</th>
              <th className="p-2 text-left">Località</th>
              <th className="p-2 text-left">Categoria</th>
              <th className="p-2 text-left">Descrizione</th>
              <th className="p-2 text-center">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {richiesteFiltrate.map((r) => (
              <tr key={r.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{r.titolo}</td>
                <td className="p-2">{r.localita}</td>
                <td className="p-2">{r.categoria}</td>
                <td className="p-2">
                  {isSospetta(r.descrizione) && (
                    <span className="bg-yellow-400 text-white px-2 py-1 rounded text-xs mr-1">
                      ⚠️ sospetta
                    </span>
                  )}
                  {r.descrizione?.slice(0, 40)}...
                </td>
                <td className="p-2 text-center flex justify-center gap-3">
                  <button
                    onClick={() => toast.info('Azione di modifica non implementata')}
                    className="text-blue-600"
                  >
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => handleElimina(r.id)}>
                    <Trash2 size={18} className="text-red-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRichiesteLavoro;


