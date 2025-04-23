// src/pages/LeTueRichieste.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE } from '../config';

const LeTueRichieste = () => {
  const [richieste, setRichieste] = useState([]);

  useEffect(() => {
    const fetchRichieste = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE}/api/richieste/mie`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRichieste(res.data);
      } catch (err) {
        console.error('Errore caricamento richieste', err);
      }
    };

    fetchRichieste();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Le tue richieste</h2>
      {richieste.length === 0 ? (
        <p>Non hai ancora inserito richieste.</p>
      ) : (
        <ul className="space-y-4">
          {richieste.map((r) => (
            <li key={r.id} className="border rounded p-4 shadow">
              <p><strong>Categoria:</strong> {r.categoria}</p>
              <p><strong>Località:</strong> {r.localita}</p>
              <p><strong>Descrizione:</strong> {r.descrizione}</p>
              <p><strong>Data:</strong> {new Date(r.data_inserimento).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LeTueRichieste;




