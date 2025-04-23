import React, { useEffect, useState } from 'react';
import { API_BASE } from '../config/config';

const AdminPagamenti = () => {
  const [transazioni, setTransazioni] = useState([]);
  const [errore, setErrore] = useState('');

  useEffect(() => {
    const fetchTransazioni = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/admin/transazioni`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!res.ok) throw new Error('Accesso negato o errore server');
        const data = await res.json();
        setTransazioni(data);
      } catch (err) {
        setErrore(err.message);
      }
    };

    fetchTransazioni();
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>📊 Transazioni recenti</h2>
      {errore && <p style={{ color: 'red' }}>{errore}</p>}

      {transazioni.length === 0 && !errore && <p>Nessuna transazione trovata.</p>}

      <table border="1" cellPadding="8" style={{ width: '100%', marginTop: '1rem' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Richiesta</th>
            <th>Email utente</th>
            <th>Categoria</th>
            <th>Località</th>
            <th>Importo (€)</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {transazioni.map((t) => {
            const emailUtente = t.impresa_email || t.professionista_email;

            return (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.richiesta_id}</td>
                <td>{emailUtente}</td>
                <td>{t.categoria}</td>
                <td>{t.localita}</td>
                <td>{t.importo.toFixed(2)}</td>
                <td>{new Date(t.data).toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPagamenti;







