// ModaleModificaCorso.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ModaleModificaCorso = ({ show, onClose, corso, onSuccess }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (corso) setFormData(corso);
  }, [corso]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/api/admin/corsi/${corso.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        const error = await res.json();
        alert('Errore: ' + (error?.message || 'Errore aggiornamento corso'));
      }
    } catch (err) {
      console.error(err);
      alert('Errore di rete');
    } finally {
      setLoading(false);
    }
  };

  if (!corso) return null;

  return (
    <Modal show={show} onHide={onClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>✏️ Modifica corso</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {Object.entries(formData).map(([key, value]) => (
            key !== 'id' && key !== 'slug' && (
              <Form.Group className="mb-2" key={key}>
                <Form.Label>{key.replace(/_/g, ' ').toUpperCase()}</Form.Label>
                <Form.Control
                  name={key}
                  value={value || ''}
                  onChange={handleChange}
                  type={key === 'prezzo' ? 'number' : 'text'}
                />
              </Form.Group>
            )
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Annulla</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Salvataggio...' : 'Salva modifiche'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModaleModificaCorso;

