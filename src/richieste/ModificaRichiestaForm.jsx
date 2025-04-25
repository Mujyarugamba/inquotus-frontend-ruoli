import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_BASE } from '../config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ModificaRichiestaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    categoria: '',
    regione: '',
    provincia: '',
    localita: '',
    descrizione: '',
    urgente: false,
    contatti: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch(`${API_BASE}/api/richiesta/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setForm(data))
      .catch(err => toast.error('Errore caricamento dati'));
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${API_BASE}/api/richiesta/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        toast.success('✅ Richiesta modificata!');
        setTimeout(() => navigate('/mie-richieste'), 2000);
      } else {
        toast.error('❌ Errore durante la modifica');
      }
    } catch (err) {
      toast.error('❌ Errore di rete');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '1rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2>✏️ Modifica Richiesta</h2>
      <input type="text" name="categoria" value={form.categoria} onChange={handleChange} placeholder="Categoria" required /><br /><br />
      <input type="text" name="regione" value={form.regione} onChange={handleChange} placeholder="Regione" required /><br /><br />
      <input type="text" name="provincia" value={form.provincia} onChange={handleChange} placeholder="Provincia" required /><br /><br />
      <input type="text" name="localita" value={form.localita} onChange={handleChange} placeholder="Comune" required /><br /><br />
      <textarea name="descrizione" value={form.descrizione} onChange={handleChange} placeholder="Descrizione dettagliata" required rows={5} /><br /><br />
      <input type="text" name="contatti" value={form.contatti} onChange={handleChange} placeholder="Contatti aggiuntivi (opzionale)" /><br /><br />
      <label>
        <input type="checkbox" name="urgente" checked={form.urgente} onChange={handleChange} /> Urgente
      </label><br /><br />
      <button type="submit" disabled={loading}>{loading ? 'Salvataggio in corso...' : 'Salva modifiche'}</button>
      <ToastContainer position="top-center" autoClose={3000} />
    </form>
  );
}

export default ModificaRichiestaForm;
