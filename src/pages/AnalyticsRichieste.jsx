import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const AnalyticsRichieste = () => {
  const [dati, setDati] = useState([]);
  const [loading, setLoading] = useState(true);
  const [utenteEmail, setUtenteEmail] = useState(null);
  const [filtroData, setFiltroData] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUtenteEmail(payload.email);
    } catch {
      setUtenteEmail(null);
    }
  }, []);

  useEffect(() => {
    const fetchDati = async () => {
      if (!utenteEmail) return;

      let query = supabase
        .from('analytics_richieste')
        .select('*')
        .eq('email_committente', utenteEmail);

      if (filtroData) {
        query = query.gte('data_evento', filtroData);
      }

      const { data, error } = await query;

      if (!error && data) {
        const aggregati = {};

        data.forEach(entry => {
          const id = entry.richiesta_id;
          if (!aggregati[id]) {
            aggregati[id] = {
              richiesta_id: id,
              viste: 0,
              sblocchi: 0
            };
          }

          if (entry.tipo_evento === 'view') aggregati[id].viste += 1;
          if (entry.tipo_evento === 'sblocco') aggregati[id].sblocchi += 1;
        });

        setDati(Object.values(aggregati));
      }

      setLoading(false);
    };

    fetchDati();
  }, [utenteEmail, filtroData]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📊 Analytics AreaLavoro</h2>

      <label style={{ marginBottom: '1rem', display: 'block' }}>
        Filtra da data (YYYY-MM-DD):
        <input
          type="date"
          value={filtroData}
          onChange={(e) => setFiltroData(e.target.value)}
          style={{ marginLeft: '1rem' }}
        />
      </label>

      {loading ? (
        <p>Caricamento dati...</p>
      ) : dati.length === 0 ? (
        <p>Nessun dato disponibile.</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={dati} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="richiesta_id" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="viste" fill="#8884d8" name="Visualizzazioni" />
            <Bar dataKey="sblocchi" fill="#82ca9d" name="Sblocchi" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default AnalyticsRichieste;
