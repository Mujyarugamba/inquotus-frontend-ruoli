// AdminIscrizioniFormazione.jsx
import React, { useEffect, useState } from 'react';
import { Button, Table, Spinner, Form, InputGroup } from 'react-bootstrap';

const AdminIscrizioniFormazione = () => {
  const [iscrizioni, setIscrizioni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroCorso, setFiltroCorso] = useState('');
  const [filtroEmail, setFiltroEmail] = useState('');
  const [filtroData, setFiltroData] = useState('');

  const fetchIscrizioni = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        corso: filtroCorso,
        email: filtroEmail,
        data: filtroData
      });
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/api/admin/iscrizioni-formazione?${params.toString()}`);
      const data = await res.json();
      setIscrizioni(data);
    } catch (err) {
      console.error('Errore nel caricamento iscrizioni:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleElimina = async (id) => {
    if (!window.confirm('Sei sicuro di voler eliminare questa iscrizione?')) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/api/admin/iscrizioni-formazione/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) fetchIscrizioni();
    } catch (err) {
      console.error('Errore eliminazione iscrizione:', err);
    }
  };

  useEffect(() => {
    fetchIscrizioni();
  }, [filtroCorso, filtroEmail, filtroData]);

  return (
    <div className="p-4">
      <h2>📚 Gestione Iscrizioni Formazione</h2>

      <Form className="mb-3 d-flex gap-2">
        <Form.Control
          type="text"
          placeholder="Filtra per corso"
          value={filtroCorso}
          onChange={(e) => setFiltroCorso(e.target.value)}
        />
        <Form.Control
          type="email"
          placeholder="Filtra per email"
          value={filtroEmail}
          onChange={(e) => setFiltroEmail(e.target.value)}
        />
        <Form.Control
          type="date"
          placeholder="Filtra per data"
          value={filtroData}
          onChange={(e) => setFiltroData(e.target.value)}
        />
      </Form>

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Corso</th>
              <th>Modalità</th>
              <th>Telefono</th>
              <th>Note</th>
              <th>Data</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {iscrizioni.map(r => (
              <tr key={r.id}>
                <td>{r.nome}</td>
                <td>{r.email}</td>
                <td>{r.corso}</td>
                <td>{r.modalita}</td>
                <td>{r.telefono}</td>
                <td>{r.note}</td>
                <td>{new Date(r.data_invio).toLocaleDateString()}</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleElimina(r.id)}
                  >
                    🗑️ Elimina
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default AdminIscrizioniFormazione;
