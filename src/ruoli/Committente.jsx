import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RichiesteMie from '../richieste/RichiesteMie';
import { AuthContext } from '../context/AuthContext';
import useRealtimeNotifiche from '../hooks/useRealtimeNotifiche';

const Committente = () => {
  const navigate = useNavigate();
  const { utente, logout } = useContext(AuthContext);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    if (!utente) return;
    if (utente.ruolo !== 'committente') navigate('/login');
  }, [utente, navigate]);

  useRealtimeNotifiche(utente?.email);

  return (
    <div style={{ padding: '1rem' }}>
      {utente?.ruolo === 'committente' && (
        <div style={{ margin: '1.5rem 0' }}>
          <button
            onClick={() => navigate('/nuova-richiesta')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#007bff',
              color: 'white',
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            ➕ Nuova richiesta
          </button>
        </div>
      )}

      <div>
        {utente?.ruolo === 'committente' ? <RichiesteMie /> : <p>Caricamento in corso...</p>}
      </div>

      {showLogoutModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 999
        }}>
          <div style={{
            background: '#fff', padding: '2rem', borderRadius: '8px', textAlign: 'center'
          }}>
            <p>Sei sicuro di voler uscire?</p>
            <button
              onClick={() => {
                setShowLogoutModal(false);
                logout();
                navigate('/login');
              }}
              style={{ marginRight: '1rem' }}
            >
              Sì, esci
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Committente;
