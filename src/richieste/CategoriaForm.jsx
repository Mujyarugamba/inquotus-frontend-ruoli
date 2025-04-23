import React, { useEffect, useState } from 'react';

const CategoriaForm = ({ onChange }) => {
  const [categorie, setCategorie] = useState({});
  const [errore, setErrore] = useState('');

  useEffect(() => {
    fetch('/categorie_raggruppate.json')
      .then(res => {
        if (!res.ok) throw new Error('Errore nel caricamento del file JSON');
        return res.json();
      })
      .then(data => {
        if (typeof data === 'object' && !Array.isArray(data)) {
          setCategorie(data);
        } else {
          setErrore('⚠️ Il file JSON non è in formato corretto');
        }
      })
      .catch(err => {
        console.error('Errore categorie:', err);
        setErrore('⚠️ Impossibile caricare le categorie');
      });
  }, []);

  return (
    <div>
      <label htmlFor="categoria">Categoria del lavoro:</label><br />
      {errore && <p style={{ color: 'red' }}>{errore}</p>}

      <select name="categoria" onChange={onChange} required>
        <option value="">-- Seleziona una categoria --</option>

        {Object.entries(categorie).map(([gruppo, opzioni]) => (
          <optgroup key={gruppo} label={gruppo}>
            {opzioni.map((cat, i) => (
              <option key={i} value={cat}>{cat}</option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
};

export default CategoriaForm;

