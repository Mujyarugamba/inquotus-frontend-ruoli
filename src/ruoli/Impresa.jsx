import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RichiesteLavoroInQuota from '../richieste/RichiesteLavoroInQuota';
import { AuthContext } from '../context/AuthContext';
import useRealtimeNotifiche from '../hooks/useRealtimeNotifiche';

const Impresa = () => {
  const navigate = useNavigate();
  const { utente, logout } = useContext(AuthContext);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    if (!utente) return;
    if (utente.ruolo !== 'impresa') navigate('/login');
  }, [utente, navigate]);

  useRealtimeNotifiche(utente?.email);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>🏗️ AreaLavoro – Impresa</h2>

      <p style={{ marginTop: '1rem' }}>
        Consulta le <strong>richieste di lavoro in quota</strong> pubblicate dai committenti. Puoi sbloccare i contatti per candidarti.
      </p>

      <div style={{ marginTop: '2rem' }}>
        <RichiesteLavoroInQuota nascondiInfoUtente={true} />
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
                setTimeout(() => {
                  logout();
                  navigate('/login');
                }, 200);
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

export default Impresa;
