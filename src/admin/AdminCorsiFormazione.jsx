// src/admin/AdminCorsiFormazione.jsx
import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import ModaleCreaCorso from '../components/ModaleCreaCorso';
import ModaleModificaCorso from '../components/ModaleModificaCorso';

const AdminCorsiFormazione = () => {
  const [corsi, setCorsi] = useState([]);
  const [showModalCrea, setShowModalCrea] = useState(false);
  const [corsoDaModificare, setCorsoDaModificare] = useState(null);

  const fetchCorsi = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/api/corsi`);
      const data = await res.json();
      setCorsi(data);
    } catch (err) {
      console.error('Errore nel recupero corsi:', err);
    }
  };

  useEffect(() => {
    fetchCorsi();
  }, []);

  const handleElimina = async (id) => {
    const conferma = window.confirm('Sei sicuro di voler eliminare questo corso?');
    if (!conferma) return;
    try {
      await fetch(`${process.env.REACT_APP_API_BASE}/api/corsi/${id}`, {
        method: 'DELETE'
      });
      fetchCorsi();
    } catch (err) {
      console.error('Errore eliminazione corso:', err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="mb-3">📚 Gestione Corsi di Formazione</h2>
      <Button variant="primary" onClick={() => setShowModalCrea(true)} className="mb-3">
        ➕ Nuovo Corso
      </Button>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Titolo</th>
            <th>Modalità</th>
            <th>Durata</th>
            <th>Prezzo</th>
            <th>Disponibile</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {corsi.map((corso) => (
            <tr key={corso.id}>
              <td>{corso.titolo}</td>
              <td>{corso.modalita}</td>
              <td>{corso.durata}</td>
              <td>€{Number(corso.prezzo).toFixed(2)}</td>
              <td>{corso.disponibilita ? '✅' : '❌'}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => setCorsoDaModificare(corso)}>
                  ✏️ Modifica
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleElimina(corso.id)}>
                  🗑️ Elimina
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <ModaleCreaCorso show={showModalCrea} handleClose={() => setShowModalCrea(false)} refresh={fetchCorsi} />
      {corsoDaModificare && (
        <ModaleModificaCorso corso={corsoDaModificare} handleClose={() => setCorsoDaModificare(null)} refresh={fetchCorsi} />
      )}
    </div>
  );
};

export default AdminCorsiFormazione;
