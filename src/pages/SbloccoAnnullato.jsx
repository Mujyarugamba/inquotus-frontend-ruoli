import React from 'react';
import { Link } from 'react-router-dom';

const SbloccoAnnullato = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>⚠️ Pagamento annullato</h2>
      <p>Non hai completato lo sblocco. Puoi riprovare quando vuoi.</p>
      <Link to="/richieste-lavoro-in-quota">
        <button style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
          Torna alle richieste
        </button>
      </Link>
    </div>
  );
};

export default SbloccoAnnullato;
