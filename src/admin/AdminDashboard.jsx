import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({ richieste: 0, utenti: 0, entrate: 0 });
  const [grafico, setGrafico] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [{ count: countRichieste }, { count: countUtenti }] = await Promise.all([
        supabase.from('richieste').select('*', { count: 'exact', head: true }),
        supabase.from('utenti').select('*', { count: 'exact', head: true })
      ]);

      // Dummy entrate Stripe (valore statico)
      const entrateStripe = 1260.50;

      setStats({
        richieste: countRichieste || 0,
        utenti: countUtenti || 0,
        entrate: entrateStripe
      });
    };

    const fetchGrafico = async () => {
      const { data, error } = await supabase
        .from('analytics_richieste')
        .select('data_evento')
        .order('data_evento', { ascending: true });

      if (!error && data) {
        const aggregati = {};
        data.forEach(entry => {
          const giorno = new Date(entry.data_evento).toISOString().split('T')[0];
          if (!aggregati[giorno]) aggregati[giorno] = 0;
          aggregati[giorno]++;
        });
        const dati = Object.entries(aggregati).map(([data_evento, conteggio]) => ({ data_evento, conteggio }));
        setGrafico(dati);
      }
      setLoading(false);
    };

    fetchStats();
    fetchGrafico();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🛠️ AreaLavoro Amministratore</h2>

      <div style={{ marginBottom: '2rem' }}>
        <p><strong>Totale richieste:</strong> {stats.richieste}</p>
        <p><strong>Totale utenti:</strong> {stats.utenti}</p>
        <p><strong>Entrate Stripe (dummy):</strong> €{stats.entrate.toFixed(2)}</p>
      </div>

      <h3>📈 Grafico richieste per giorno</h3>
      {loading ? (
        <p>Caricamento grafico...</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={grafico}>
            <XAxis dataKey="data_evento" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="conteggio" fill="#8884d8" name="Richieste" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default AdminDashboard;






