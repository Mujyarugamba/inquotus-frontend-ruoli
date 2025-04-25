import React, { useState, useEffect } from 'react';
import { API_BASE } from '../config';

const RichiestaForm = () => {
  const [categorieRaggruppate, setCategorieRaggruppate] = useState([]);
  const [categoria, setCategoria] = useState('');
  const [regione, setRegione] = useState('');
  const [provinceDisponibili, setProvinceDisponibili] = useState([]);
  const [provincia, setProvincia] = useState('');
  const [localita, setLocalita] = useState('');
  const [comuni, setComuni] = useState([]);
  const [descrizione, setDescrizione] = useState('');
  const [file, setFile] = useState(null);
  const [contatti, setContatti] = useState('');
  const [urgenza, setUrgenza] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messaggio, setMessaggio] = useState('');

  useEffect(() => {
    fetch('/data/categorie_raggruppate.json')
      .then(res => res.json())
      .then(data => setCategorieRaggruppate(data));

    fetch('/data/province/province-per-regione.json')
      .then(res => res.json())
      .then(data => setProvinceDisponibili(data));
  }, []);

  useEffect(() => {
    if (provincia) {
      fetch(`/data/comuni/${provincia}.json`)
        .then(res => res.json())
        .then(data => setComuni(data))
        .catch(() => setComuni([]));
    } else {
      setComuni([]);
    }
  }, [provincia]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');
    let media_url = '';

    try {
      if (file) {
        const formData = new FormData();
        formData.append('immagine', file);

        const uploadRes = await fetch(`${API_BASE}/api/upload`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData
        });

        const uploadData = await uploadRes.json();
        media_url = uploadData.url;
      }

      const body = {
        categoria,
        localita,
        provincia,
        regione,
        descrizione,
        media_url,
        contatti,
        urgenza
      };

      const res = await fetch(`${API_BASE}/api/richiesta`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        setMessaggio('✅ Richiesta inviata con successo!');
        setCategoria('');
        setRegione('');
        setProvincia('');
        setLocalita('');
        setDescrizione('');
        setFile(null);
        setContatti('');
        setUrgenza(false);
      } else {
        const errData = await res.json();
        setMessaggio(`❌ Errore: ${errData.error || 'invio fallito'}`);
      }
    } catch (err) {
      console.error(err);
      setMessaggio('❌ Errore di rete o server');
    } finally {
      setLoading(false);
    }
  };

  const regioni = Object.keys(provinceDisponibili);
  const provinceFiltrate = regione ? provinceDisponibili[regione] || [] : [];

  return (
    <form onSubmit={handleSubmit} style={{ padding: '1rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2>📝 Nuova Richiesta</h2>

      <label>Categoria:</label>
      <select
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
        required
        style={{ width: '100%', marginBottom: '1rem' }}
      >
        <option value="">Seleziona una categoria</option>
        {categorieRaggruppate.map((gruppo, i) => (
          <optgroup key={i} label={`✅ ${gruppo.gruppo}`}>
            {gruppo.categorie.map((c, j) => (
              <option key={j} value={c}>{c}</option>
            ))}
          </optgroup>
        ))}
      </select>

      <label>Regione:</label>
      <select
        value={regione}
        onChange={(e) => setRegione(e.target.value)}
        required
        style={{ display: 'block', marginBottom: '1rem', width: '100%' }}
      >
        <option value="">Seleziona una regione</option>
        {regioni.map((reg) => (
          <option key={reg} value={reg}>{reg}</option>
        ))}
      </select>

      <label>Provincia:</label>
      <select
        value={provincia}
        onChange={(e) => setProvincia(e.target.value)}
        required
        style={{ display: 'block', marginBottom: '1rem', width: '100%' }}
      >
        <option value="">Seleziona una provincia</option>
        {provinceFiltrate.map((prov) => (
          <option key={prov} value={prov}>{prov}</option>
        ))}
      </select>

      <label>Comune:</label>
      <input
        type="text"
        list="elenco-comuni"
        value={localita}
        onChange={(e) => setLocalita(e.target.value)}
        placeholder="Comune"
        required
        style={{ display: 'block', marginBottom: '1rem', width: '100%' }}
      />
      <datalist id="elenco-comuni">
        {comuni.map((comune, i) => (
          <option key={i} value={comune} />
        ))}
      </datalist>

      <textarea
        value={descrizione}
        onChange={(e) => setDescrizione(e.target.value)}
        placeholder="Descrizione dettagliata"
        required
        rows={5}
        style={{ display: 'block', marginBottom: '1rem', width: '100%' }}
      />

      <input
        type="text"
        value={contatti}
        onChange={(e) => setContatti(e.target.value)}
        placeholder="Contatti aggiuntivi (opzionale)"
        style={{ display: 'block', marginBottom: '1rem', width: '100%' }}
      />

      <label>
        <input
          type="checkbox"
          checked={urgenza}
          onChange={(e) => setUrgenza(e.target.checked)}
        />{' '}
        Urgente
      </label>

      <input
        type="file"
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'block', marginBottom: '1rem' }}
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Invio in corso...' : 'Invia richiesta'}
      </button>

      {messaggio && (
        <p style={{ marginTop: '1rem', color: messaggio.startsWith('✅') ? 'green' : 'red' }}>
          {messaggio}
        </p>
      )}
    </form>
  );
};

export default RichiestaForm;
