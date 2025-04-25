import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE } from '../config';

const RichiestaModifica = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [richiesta, setRichiesta] = useState(null);
  const [regioni, setRegioni] = useState([]);
  const [province, setProvince] = useState([]);
  const [comuni, setComuni] = useState([]);
  const [messaggio, setMessaggio] = useState('');
  const token = localStorage.getItem('token');

  // Carica dati iniziali
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/richiesta/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Errore');
        setRichiesta(data);
      } catch (err) {
        setMessaggio('❌ Errore caricamento richiesta');
      }
    };

    fetchData();
    fetch('/data/province-per-regione.json')
      .then(res => res.json())
      .then(setRegioni)
      .catch(() => setMessaggio('❌ Errore caricamento regioni'));
  }, [id, token]);

  // Carica province in base alla regione
  useEffect(() => {
    if (richiesta?.regione) {
      const selected = regioni.find(r => r.nome === richiesta.regione);
      setProvince(selected?.province || []);
    }
  }, [richiesta?.regione, regioni]);

  // Carica comuni
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
    try {
      const res = await fetch(`${API_BASE}/api/richiesta/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(richiesta)
      });
      const data = await res.json();
      if (res.ok) {
        setMessaggio('✅ Richiesta aggiornata con successo');
        setTimeout(() => navigate('/mie-richieste'), 1500);
      } else {
        setMessaggio(`❌ ${data.error || 'Errore salvataggio'}`);
      }
    } catch {
      setMessaggio('❌ Errore di rete');
    }
  };

  if (!richiesta) return <p>⏳ Caricamento...</p>;

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
      {messaggio && <p style={{ marginTop: '1rem', color: messaggio.startsWith('✅') ? 'green' : 'red' }}>{messaggio}</p>}
    </form>
  );
};

export default RichiestaModifica;

