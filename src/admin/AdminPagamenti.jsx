import React, { useEffect, useState } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { format, startOfDay, getWeek, getYear } from 'date-fns';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';

const AdminPagamenti = () => {
  const [transazioni, setTransazioni] = useState([]);
  const [filtroEmail, setFiltroEmail] = useState('');
  const [filtroDal, setFiltroDal] = useState('');
  const [filtroAl, setFiltroAl] = useState('');
  const [errore, setErrore] = useState('');
  const [pagina, setPagina] = useState(1);
  const [loading, setLoading] = useState(false);  // Stato per il caricamento
  const [modalitaRaggruppamento, setModalitaRaggruppamento] = useState(
    localStorage.getItem('modalitaRaggruppamento') || 'giorno'
  );
  const perPagina = 10;

  useEffect(() => {
    const fetchTransazioni = async () => {
      setLoading(true); // Inizia il caricamento
      try {
        const query = new URLSearchParams({
          page: pagina,
          email: filtroEmail,
          dal: filtroDal,
          al: filtroAl
        }).toString();
        
        const res = await fetch(`/api/admin/transazioni?${query}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!res.ok) throw new Error('Accesso negato o errore server');
        const data = await res.json();
        setTransazioni(data);
      } catch (err) {
        setErrore(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false); // Termina il caricamento
      }
    };

    fetchTransazioni();
  }, [pagina]);

  const transazioniFiltrate = transazioni.filter(t => {
    const emailUtente = t.impresa_email || t.professionista_email;
    const matchEmail = emailUtente.toLowerCase().includes(filtroEmail.toLowerCase());
    const dataTransazione = new Date(t.data);
    const matchDal = filtroDal ? new Date(t.data).toISOString() >= new Date(filtroDal).toISOString() : true;
    const matchAl = filtroAl ? new Date(t.data).toISOString() <= new Date(filtroAl).toISOString() : true;
    return matchEmail && matchDal && matchAl;
  });

  const esportaCSV = () => {
    const csvData = transazioniFiltrate.map(t => ({
      ID: t.id,
      Email: t.impresa_email || t.professionista_email,
      Richiesta: t.richiesta_id,
      Categoria: t.categoria,
      Località: t.localita,
      Importo: t.importo.toFixed(2),
      Data: format(new Date(t.data), 'yyyy-MM-dd HH:mm')
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'pagamenti.csv');
  };

  const transazioniRaggruppate = transazioniFiltrate.reduce((acc, t) => {
    let chiave = '';
    const data = new Date(t.data);
    if (modalitaRaggruppamento === 'settimana') {
      const settimana = getWeek(data);
      const anno = getYear(data);
      chiave = `Settimana ${settimana} – ${format(data, 'MMMM yyyy')}`;
    } else {
      chiave = format(startOfDay(data), 'yyyy-MM-dd');
    }
    if (!acc[chiave]) acc[chiave] = [];
    acc[chiave].push(t);
    return acc;
  }, {});

  const handleModalitaChange = (e) => {
    const value = e.target.value;
    setModalitaRaggruppamento(value);
    localStorage.setItem('modalitaRaggruppamento', value);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">💳 Elenco Pagamenti Effettuati</h2>

      <div className="mb-4 flex flex-wrap gap-2 items-end">
        <Input
          placeholder="Filtra per email utente"
          value={filtroEmail}
          onChange={e => setFiltroEmail(e.target.value)}
        />
        <Input
          type="date"
          value={filtroDal}
          onChange={e => setFiltroDal(e.target.value)}
          title="Dal"
        />
        <Input
          type="date"
          value={filtroAl}
          onChange={e => setFiltroAl(e.target.value)}
          title="Al"
        />
        <select
          className="border px-2 py-1 rounded text-sm"
          value={modalitaRaggruppamento}
          onChange={handleModalitaChange}
        >
          <option value="giorno">📅 Raggruppa per giorno</option>
          <option value="settimana">🗓️ Raggruppa per settimana</option>
        </select>
        <Button onClick={esportaCSV}>📤 Esporta CSV</Button>
        <span className="text-sm text-gray-500">Totale: {transazioniFiltrate.length}</span>
      </div>

      {loading && <p className="text-center">Caricamento in corso...</p>}

      {errore && <p className="text-red-600 mb-4">{errore}</p>}

      {Object.entries(transazioniRaggruppate).map(([gruppo, transazioni]) => (
        <div key={gruppo} className="mb-6">
          <h3 className="text-md font-semibold mb-2">📅 {modalitaRaggruppamento === 'settimana' ? gruppo : format(new Date(gruppo), 'dd/MM/yyyy')}</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Richiesta</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Località</TableHead>
                <TableHead>Importo</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transazioni.map(t => (
                <TableRow key={t.id}>
                  <TableCell>{t.id}</TableCell>
                  <TableCell>{t.richiesta_id}</TableCell>
                  <TableCell>{t.impresa_email || t.professionista_email}</TableCell>
                  <TableCell>{t.categoria}</TableCell>
                  <TableCell>{t.localita}</TableCell>
                  <TableCell>{t.importo.toFixed(2)} €</TableCell>
                  <TableCell>{format(new Date(t.data), 'HH:mm')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}

      <div className="flex justify-center gap-2 mt-4">
        {[...Array(5)].map((_, i) => (
          <Button
            key={i}
            size="sm"
            variant={pagina === i + 1 ? 'default' : 'outline'}
            onClick={() => setPagina(i + 1)}
          >
            {i + 1}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default AdminPagamenti;








