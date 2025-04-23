import React from 'react';
import { Link } from 'react-router-dom';

const SbloccoSuccesso = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>✅ Sblocco completato con successo!</h2>
      <p>Ora puoi visualizzare i contatti del committente nella tua area riservata.</p>
      <Link to="/home">
        <button style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
          Vai all'area riservata
        </button>
      </Link>
    </div>
  );
};

export default SbloccoSuccesso;
