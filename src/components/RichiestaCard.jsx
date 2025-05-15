import React from 'react';
import { useNavigate } from 'react-router-dom';

const RichiestaCard = ({ richiesta, utente, handleSblocca }) => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        border: '1px solid #ccc',
        padding: '1rem',
        borderRadius: '8px',
        backgroundColor: '#fafafa',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p><strong>Categoria:</strong> {richiesta.categoria}</p>
      </div>
      <p><strong>Regione:</strong> {richiesta.regione}</p>
      <p><strong>Provincia:</strong> {richiesta.provincia}</p>
      <p><strong>Comune:</strong> {richiesta.localita}</p>
      <p><strong>Descrizione:</strong> {richiesta.descrizione.slice(0, 100)}...</p>

      {utente && (
        <div style={{ marginTop: '0.3rem' }}>
          <strong>Contatti:</strong>
          <span
            style={{
              display: 'inline-block',
              padding: '0.2rem 0.6rem',
              marginLeft: '0.5rem',
              borderRadius: '12px',
              backgroundColor: richiesta.sbloccata === 'si' ? '#28a745' : '#ffc107',
              color: '#fff',
              fontSize: '0.75rem'
            }}
          >
            {richiesta.sbloccata === 'si' ? 'Sbloccata' : 'Da sbloccare'}
          </span>
        </div>
      )}

      <button
        onClick={() =>
          richiesta.sbloccata === 'si'
            ? navigate(`/richiesta/${richiesta.id}`)
            : handleSblocca(richiesta.id)
        }
        style={{
          marginTop: '0.5rem',
          backgroundColor: richiesta.sbloccata === 'si' ? 'gray' : '#007bff',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          cursor: 'pointer',
          borderRadius: '5px'
        }}
      >
        {richiesta.sbloccata === 'si' ? '👁️ Visualizza richiesta' : '🔓 Sblocca contatti'}
      </button>
    </div>
  );
};

export default RichiestaCard;


