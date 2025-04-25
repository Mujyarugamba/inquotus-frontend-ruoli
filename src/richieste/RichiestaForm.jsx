import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE } from '../config';
import { AuthContext } from '../context/AuthContext';
import useUploadImmagine from '../hooks/useUploadImmagine';

const RichiestaForm = ({ isEditMode = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { utente } = useContext(AuthContext);
  const token = localStorage.getItem('token');
  const { upload } = useUploadImmagine();

  const [formData, setFormData] = useState({
    categoria: '',
    regione: '',
    provincia: '',
    localita: '',
    descrizione: '',
    contatti: '',
    urgente: false
  });
  const [file, setFile] = useState(null);
  const [categorieRaggruppate, setCategorieRaggruppate] = useState([]);
  const [regioni, setRegioni] = useState([]);
  const [province, setProvince] = useState([]);
  const [comuni, setComuni] = useState([]);
  const [messaggio, setMessaggio] = useState('');

  useEffect(() => {
    fetch('/data/categorie_raggruppate.json')
      .then(res => res.json())
      .then(setCategorieRaggruppate)
      .catch(() => setCategorieRaggruppate([]));

    fetch('/data/regioni.json')
      .then(res => res.json())
      .then(setRegioni)
      .catch(() => setMessaggio('❌ Errore caricamento regioni'));

    if (isEditMode && id) {
      fetch(`${API_BASE}/api/richiesta/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data && data.id) {
            setFormData({
              categoria: data.categoria,
              regione: data.regione,
              provincia: data.provincia,
              localita: data.localita,
              descrizione: data.descrizione,
              contatti: data.contatti || '',
              urgente: data.urgente || false
            });
          } else {
            setMessaggio('❌ Errore caricamento dati.');
          }
        })
        .catch(() => setMessaggio('❌ Errore rete o token non valido'));
    }
  }, [id, isEditMode, token]);

  useEffect(() => {
    if (formData.regione) {
      fetch(`/data/province/${formData.regione}.json`)
        .then(res => res.json())
        .then(setProvince)
        .catch(() => setProvince([]));
    } else {
      setProvince([]);
    }
  }, [formData.regione]);

  useEffect(() => {
    if (formData.provincia) {
      fetch(`/data/comuni/${formData.provincia}.json`)
        .then(res => res.json())
        .then(setComuni)
        .catch(() => setComuni([]));
    } else {
      setComuni([]);
    }
  }, [formData.provincia]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let immagineUrl = '';
    if (file && utente?.email) {
      immagineUrl = await upload(file, utente.email);
    }

    const endpoint = isEditMode ? `${API_BASE}/api/richiesta/${id}` : `${API_BASE}/api/richiesta`;
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ...formData, media_url: immagineUrl })
      });
      const data = await res.json();
      if (res.ok) {
        setMessaggio('✅ Richiesta salvata con successo!');
        setTimeout(() => navigate('/mie-richieste'), 1500);
      } else {
        setMessaggio(`❌ ${data.error || 'Errore salvataggio'}`);
      }
    } catch (err) {
      setMessaggio('❌ Errore di rete');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '2rem auto' }}>
      <h2>{isEditMode ? '✏️ Modifica Richiesta' : '📝 Nuova Richiesta'}</h2>

      {/* CATEGORIE */}
      <select name="categoria" value={formData.categoria} onChange={handleChange} required style={{ width: '100%', marginBottom: '1rem' }}>
        <option value="">Seleziona una categoria</option>
        {categorieRaggruppate.map(gruppo => (
          <optgroup key={gruppo.gruppo} label={gruppo.gruppo}>
            {gruppo.categorie.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </optgroup>
        ))}
      </select>

      {/* LOCALITÀ */}
      <select name="regione" value={formData.regione} onChange={handleChange} required style={{ width: '100%', marginBottom: '1rem' }}>
        <option value="">Seleziona una regione</option>
        {regioni.map(reg => (
          <option key={reg} value={reg}>{reg}</option>
        ))}
      </select>

      <select name="provincia" value={formData.provincia} onChange={handleChange} required style={{ width: '100%', marginBottom: '1rem' }}>
        <option value="">Seleziona una provincia</option>
        {province.map(p => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      <select name="localita" value={formData.localita} onChange={handleChange} required style={{ width: '100%', marginBottom: '1rem' }}>
        <option value="">Seleziona un comune</option>
        {comuni.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      {/* DESCRIZIONE */}
      <textarea name="descrizione" value={formData.descrizione} onChange={handleChange} placeholder="Descrizione dettagliata" required rows={5} style={{ width: '100%', marginBottom: '1rem' }} />

      {/* CONTATTI E URGENZA */}
      <input name="contatti" value={formData.contatti} onChange={handleChange} placeholder="Contatti aggiuntivi" style={{ width: '100%', marginBottom: '1rem' }} />

      <label>
        <input type="checkbox" name="urgente" checked={formData.urgente} onChange={handleChange} />{' '}
        Urgente
      </label>

      {/* UPLOAD IMMAGINE */}
      <div style={{ marginTop: '1rem' }}>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
      </div>

      <br />
      <button type="submit">{isEditMode ? '💾 Salva modifiche' : 'Invia richiesta'}</button>

      {messaggio && (
        <p style={{ marginTop: '1rem', color: messaggio.startsWith('✅') ? 'green' : 'red' }}>{messaggio}</p>
      )}
    </form>
  );
};

export default RichiestaForm;
