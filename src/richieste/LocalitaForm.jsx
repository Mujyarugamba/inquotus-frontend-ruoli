import React, { useEffect, useState } from 'react';

const LocalitaForm = ({ onChange }) => {
  const [comuni, setComuni] = useState([]);
  const [regioni, setRegioni] = useState([]);
  const [regioneSelezionata, setRegioneSelezionata] = useState('');
  const [comuniFiltrati, setComuniFiltrati] = useState([]);

  useEffect(() => {
    fetch('/comuni-ridotti.json')
      .then(res => res.json())
      .then(data => {
        setComuni(data);
        const regioniUniche = [...new Set(data.map(c => c.regione))];
        setRegioni(regioniUniche.sort());
      })
      .catch(err => console.error('Errore nel caricamento:', err));
  }, []);

  useEffect(() => {
    if (regioneSelezionata) {
      const filtrati = comuni.filter(c => c.regione === regioneSelezionata);
      setComuniFiltrati(filtrati);
    }
  }, [regioneSelezionata, comuni]);

  return (
    <div>
      <label>Regione:</label><br />
      <select
        name="regione"
        onChange={(e) => {
          setRegioneSelezionata(e.target.value);
          onChange(e);
        }}
        required
      >
        <option value="">-- Seleziona --</option>
        {regioni.map((r, i) => (
          <option key={i} value={r}>{r}</option>
        ))}
      </select><br /><br />

      <label>Comune:</label><br />
      <select name="comune" onChange={onChange} required>
        <option value="">-- Seleziona --</option>
        {comuniFiltrati.map((c, i) => (
          <option key={i} value={c.nome}>{c.nome}</option>
        ))}
      </select><br /><br />

      <label>Via:</label><br />
      <input type="text" name="via" onChange={onChange} /><br /><br />

      <label>Civico:</label><br />
      <input type="text" name="civico" onChange={onChange} /><br />
    </div>
  );
};

export default LocalitaForm;







