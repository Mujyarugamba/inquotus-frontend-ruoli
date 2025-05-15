// ModaleCreaCorso.jsx
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ModaleCreaCorso = ({ show, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    titolo: '',
    descrizione: '',
    durata: '',
    prezzo: '',
    ente_erogatore: '',
    certificazione: '',
    data_prossima_edizione: '',
    sede: '',
    prerequisiti: '',
    dotazioni: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/api/admin/corsi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        const error = await res.json();
        alert('Errore: ' + (error?.message || 'Errore creazione corso'));
      }
    } catch (err) {
      console.error(err);
      alert('Errore di rete');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>➕ Crea nuovo corso</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {Object.entries(formData).map(([key, value]) => (
            <Form.Group className="mb-2" key={key}>
              <Form.Label>{key.replace(/_/g, ' ').toUpperCase()}</Form.Label>
              <Form.Control
                name={key}
                value={value}
                onChange={handleChange}
                type={key === 'prezzo' ? 'number' : 'text'}
              />
            </Form.Group>
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Annulla</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Salvataggio...' : 'Salva Corso'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModaleCreaCorso;
