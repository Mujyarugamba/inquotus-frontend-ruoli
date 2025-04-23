import React, { useEffect, useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { supabase } from '../config/supabaseClient';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { utente, logout } = useContext(AuthContext);
  const [notificheNonLette, setNotificheNonLette] = useState(0);

  useEffect(() => {
    if (!utente?.email) return;

    const fetchCount = async () => {
      const { count } = await supabase
        .from('notifiche')
        .select('*', { count: 'exact', head: true })
        .eq('email_utente', utente.email)
        .eq('letto', false);

      setNotificheNonLette(count || 0);
    };

    fetchCount();

    const channel = supabase
      .channel('notifiche-navbar')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifiche',
      }, (payload) => {
        if (payload.new?.email_utente === utente?.email) {
          fetchCount();
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [utente]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isImpresa = utente?.ruolo === 'impresa';
  const isProfessionista = utente?.ruolo === 'professionista';
  const isCommittente = utente?.ruolo === 'committente';
  const isAdmin = utente?.ruolo === 'admin';

  return (
    <nav style={{
      padding: '1rem',
      background: '#f2f2f2',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <Link to="/">🏠 Home</Link>{' | '}
        <Link to="/richieste-lavoro-in-quota">🔍 Richieste di lavoro in quota</Link>{' | '}

        {utente && (
          <>
            <Link to="/home">📂 AreaLavoro</Link>{' | '}
            {(isImpresa || isProfessionista) && (
              <>
                <Link to="/sblocchi-effettuati">🔓 Sblocchi effettuati</Link>{' | '}
                <Link to="/richieste-salvate">⭐ Richieste salvate</Link>{' | '}
              </>
            )}
            <Link to="/storico-notifiche" style={{ position: 'relative' }}>
              📜 Storico notifiche
              {notificheNonLette > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-10px',
                  background: 'red',
                  color: 'white',
                  borderRadius: '50%',
                  padding: '2px 6px',
                  fontSize: '0.7rem',
                  fontWeight: 'bold'
                }}>
                  {notificheNonLette}
                </span>
              )}
            </Link>
            {' | '}
            {isCommittente && (
              <Link to="/analytics-richieste">📊 Analytics</Link>
            )}
            {isAdmin && (
              <>
                {' | '}
                <Link to="/admin/dashboard">🛠️ Admin Dashboard</Link>{' | '}
                <Link to="/admin/pagamenti">💳 Pagamenti</Link>
              </>
            )}
          </>
        )}

        {!utente && (
          <>
            {' | '}
            <Link to="/magic-link">✨ Magic Link Login</Link>{' | '}
            <Link to="/register">📝 Registrati</Link>
          </>
        )}
      </div>

      {utente && (
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 'bold' }}>🔐 Area riservata</div>
          <div>👋 Benvenuto, {utente.nome || utente.email} ({utente.ruolo})</div>
          <button onClick={handleLogout} style={{ marginTop: '0.3rem', color: 'red' }}>🔓 Logout</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;








