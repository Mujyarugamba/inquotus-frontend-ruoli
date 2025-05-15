import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE } from '../config';
import { toast } from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';
import { logoutAutomatico } from '../hooks/logoutAutomatico'; // 👈 IMPORT logoutAutomatico

const RichiestaModifica = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [richiesta, setRichiesta] = useState(null);
  const [regioni, setRegioni] = useState([]);
  const [province, setProvince] = useState([]);
  const [comuni, setComuni] = useState([]);
  const [messaggio, setMessaggio] = useState('');
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/richiesta/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.status === 401) {
          logoutAutomatico();
          return;
        }
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Errore');
        setRichiesta(data);
      } catch (err) {
        setMessaggio('❌ Errore caricamento richiesta');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    fetch('/data/province-per-regione.json')
      .then(res => res.json())
      .then(setRegioni)
      .catch(() => setMessaggio('❌ Errore caricamento regioni'));
  }, [id, token]);

  useEffect(() => {
    if (richiesta?.regione) {
      const selected = regioni.find(r => r.nome === richiesta.regione);
      setProvince(selected?.province || []);
    }
  }, [richiesta?.regione, regioni]);

  useEffect(() => {
    if (richiesta?.provincia) {
      fetch(`/data/comuni/${richiesta.provincia}.json`)
        .then(res => res.json())
        .then(setComuni)
        .catch(() => setComuni([]));
    }
  }, [richiesta?.provincia]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRichiesta(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (e) => {
    setRichiesta(prev => ({ ...prev, urgente: e.target.checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/richiesta/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(richiesta)
      });
      if (res.status === 401) {
        logoutAutomatico();
        return;
      }
      const data = await res.json();
      if (res.ok) {
        toast.success('✅ Modifica salvata con successo!');
        navigate('/mie-richieste');
      } else {
        toast.error(`❌ ${data.error || 'Errore salvataggio'}`);
      }
    } catch {
      toast.error('❌ Errore di rete');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
        <ClipLoader color="#667eea" size={50} />
      </div>
    );
  }

  if (!richiesta) return <p>❌ Richiesta non trovata.</p>;

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h2>✏️ Modifica Richiesta</h2>

      <label>Categoria:</label>
      <input name="categoria" value={richiesta.categoria} onChange={handleChange} required />

      <label>Regione:</label>
      <select name="regione" value={richiesta.regione} onChange={handleChange} required>
        <option value="">Seleziona una regione</option>
        {regioni.map(r => (
          <option key={r.nome} value={r.nome}>{r.nome}</option>
        ))}
      </select>

      <label>Provincia:</label>
      <select name="provincia" value={richiesta.provincia} onChange={handleChange} required>
        <option value="">Seleziona una provincia</option>
        {province.map(p => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      <label>Comune:</label>
      <input list="comuni" name="localita" value={richiesta.localita} onChange={handleChange} required />
      <datalist id="comuni">
        {comuni.map(c => (
          <option key={c}>{c}</option>
        ))}
      </datalist>

      <label>Descrizione:</label>
      <textarea name="descrizione" value={richiesta.descrizione} onChange={handleChange} rows={4} required />

      <label>Contatti aggiuntivi:</label>
      <input name="contatti" value={richiesta.contatti || ''} onChange={handleChange} />

      <label>
        <input type="checkbox" checked={richiesta.urgente} onChange={handleCheckbox} /> Urgente
      </label>

      <br /><br />
      <button type="submit">💾 Salva modifiche</button>

      {messaggio && (
        <p style={{ marginTop: '1rem', color: messaggio.startsWith('✅') ? 'green' : 'red' }}>
          {messaggio}
        </p>
      )}
    </form>
  );
};

export default RichiestaModifica;
