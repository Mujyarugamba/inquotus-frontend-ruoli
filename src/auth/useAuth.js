import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE } from '../config';

const RichiesteLavoroInQuota = () => {
  const [richieste, setRichieste] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroComune, setFiltroComune] = useState('');
  const [paginaCorrente, setPaginaCorrente] = useState(1);
  const richiestePerPagina = 5;

  useEffect(() => {
    fetch(`${API_BASE}/api/richieste`)
      .then((res) => res.json())
      .then((data) => setRichieste(data))
      .catch((err) => console.error('Errore caricamento richieste:', err));
  }, []);

  const richiesteFiltrate = richieste.filter((r) => {
    return (
      (!filtroCategoria || r.categoria.toLowerCase().includes(filtroCategoria.toLowerCase())) &&
      (!filtroComune || r.localita.toLowerCase().includes(filtroComune.toLowerCase()))
    );
  });

  const inizio = (paginaCorrente - 1) * richiestePerPagina;
  const richiestePagina = richiesteFiltrate.slice(inizio, inizio + richiestePerPagina);
  const pagineTotali = Math.ceil(richiesteFiltrate.length / richiestePerPagina);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Richieste disponibili</h2>

      {/* Filtri */}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Filtra per categoria"
          value={filtroCategoria}
          onChange={(e) => {
            setFiltroCategoria(e.target.value);
            setPaginaCorrente(1);
          }}
          style={{ marginRight: '0.5rem' }}
        />
        <input
          type="text"
          placeholder="Filtra per comune"
          value={filtroComune}
          onChange={(e) => {
            setFiltroComune(e.target.value);
            setPaginaCorrente(1);
          }}
        />
      </div>

      {/* Elenco richieste */}
      {richiestePagina.length === 0 && <p>Nessuna richiesta trovata.</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {richiestePagina.map((r) => (
          <li key={r.id} style={{ border: '1px solid #ccc', marginBottom: '1rem', padding: '1rem', borderRadius: '8px' }}>
            <strong>Categoria:</strong> {r.categoria}<br />
            <strong>Comune:</strong> {r.localita}<br />
            <strong>Data:</strong> {new Date(r.data_inserimento).toLocaleDateString()}<br /><br />
            <Link to={`/richiesta/${r.id}`}>🔍 Vedi dettagli</Link>
          </li>
        ))}
      </ul>

      {/* Navigazione pagine */}
      {pagineTotali > 1 && (
        <div style={{ marginTop: '1rem' }}>
          <button
            onClick={() => setPaginaCorrente((p) => Math.max(p - 1
