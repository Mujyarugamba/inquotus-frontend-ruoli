import React, { useEffect, useState } from 'react';
import supabase from '../config/supabaseClient';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ richieste: 0, utenti: 0, corsi: 0, iscrizioni: 0, notifiche: 0 });
  const [graficoRichieste, setGraficoRichieste] = useState([]);
  const [graficoUtenti, setGraficoUtenti] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [
        { count: countRichieste },
        { count: countUtenti },
        { count: countCorsi },
        { count: countIscrizioni },
        { count: countNotifiche }
      ] = await Promise.all([
        supabase.from('richieste').select('*', { count: 'exact', head: true }),
        supabase.from('utenti').select('*', { count: 'exact', head: true }),
        supabase.from('corsi_formazione').select('*', { count: 'exact', head: true }),
        supabase.from('iscrizioni_formazione').select('*', { count: 'exact', head: true }),
        supabase.from('notifiche').select('*', { count: 'exact', head: true })
      ]);

      setStats({
        richieste: countRichieste || 0,
        utenti: countUtenti || 0,
        corsi: countCorsi || 0,
        iscrizioni: countIscrizioni || 0,
        notifiche: countNotifiche || 0
      });
    };

    const fetchGrafico = async () => {
      const [richiesteRes, utentiRes] = await Promise.all([
        supabase.from('analytics_richieste').select('data_evento'),
        supabase.from('utenti').select('created_at')
      ]);

      if (richiesteRes.data) {
        const aggregatiRichieste = {};
        richiesteRes.data.forEach(entry => {
          const giorno = new Date(entry.data_evento).toISOString().split('T')[0];
          if (!aggregatiRichieste[giorno]) aggregatiRichieste[giorno] = 0;
          aggregatiRichieste[giorno]++;
        });
        setGraficoRichieste(Object.entries(aggregatiRichieste).map(([data_evento, conteggio]) => ({ data_evento, conteggio })));
      }

      if (utentiRes.data) {
        const aggregatiUtenti = {};
        utentiRes.data.forEach(entry => {
          const giorno = new Date(entry.created_at).toISOString().split('T')[0];
          if (!aggregatiUtenti[giorno]) aggregatiUtenti[giorno] = 0;
          aggregatiUtenti[giorno]++;
        });
        setGraficoUtenti(Object.entries(aggregatiUtenti).map(([data_evento, conteggio]) => ({ data_evento, conteggio })));
      }

      setLoading(false);
    };

    fetchStats();
    fetchGrafico();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="mb-4">🛠️ Pannello Amministratore Inquotus</h2>

      <div className="row mb-4">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="col-md-4 mb-3">
            <div className="card text-white bg-primary h-100">
              <div className="card-body">
                <h5 className="card-title text-capitalize">{key}</h5>
                <p className="card-text display-6">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h4 className="mt-5">📈 Richieste pubbliche per giorno</h4>
      {loading ? <p>Caricamento grafico...</p> : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={graficoRichieste}>
            <XAxis dataKey="data_evento" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="conteggio" fill="#0d6efd" name="Richieste" />
          </BarChart>
        </ResponsiveContainer>
      )}

      <h4 className="mt-5">👥 Nuovi utenti per giorno</h4>
      {loading ? <p>Caricamento grafico...</p> : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={graficoUtenti}>
            <XAxis dataKey="data_evento" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="conteggio" fill="#198754" name="Utenti" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default AdminDashboard;






