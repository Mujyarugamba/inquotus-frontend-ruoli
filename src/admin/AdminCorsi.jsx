// AdminCorsi.jsx
import React, { useEffect, useState } from 'react';
import { Button, Table, Spinner } from 'react-bootstrap';
import ModaleCreaCorso from './ModaleCreaCorso';
import ModaleModificaCorso from './ModaleModificaCorso';

const AdminCorsi = () => {
  const [corsi, setCorsi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCrea, setShowCrea] = useState(false);
  const [corsoDaModificare, setCorsoDaModificare] = useState(null);

  const fetchCorsi = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/api/admin/corsi`);
      const data = await res.json();
      setCorsi(data);
    } catch (err) {
      console.error('Errore nel caricamento corsi:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleElimina = async (id) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo corso?')) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/api/admin/corsi/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) fetchCorsi();
    } catch (err) {
      console.error('Errore eliminazione corso:', err);
    }
  };

  useEffect(() => {
    fetchCorsi();
  }, []);

  return (
    <div className="p-4">
      <h2>📚 Gestione Corsi</h2>
      <Button variant="success" className="mb-3" onClick={() => setShowCrea(true)}>
        ➕ Nuovo corso
      </Button>

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Titolo</th>
              <th>Ente</th>
              <th>Prossima edizione</th>
              <th>Disponibile</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {corsi.map(corso => (
              <tr key={corso.id}>
                <td>{corso.titolo}</td>
                <td>{corso.ente_erogatore}</td>
                <td>{new Date(corso.data_prossima_edizione).toLocaleDateString()}</td>
                <td>{corso.disponibilita ? '✅' : '❌'}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => setCorsoDaModificare(corso)}
                    className="me-2"
                  >
                    ✏️ Modifica
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleElimina(corso.id)}
                  >
                    🗑️ Elimina
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <ModaleCreaCorso show={showCrea} onClose={() => setShowCrea(false)} onSuccess={fetchCorsi} />
      <ModaleModificaCorso
        show={!!corsoDaModificare}
        corso={corsoDaModificare}
        onClose={() => setCorsoDaModificare(null)}
        onSuccess={fetchCorsi}
      />
    </div>
  );
};

export default AdminCorsi;
