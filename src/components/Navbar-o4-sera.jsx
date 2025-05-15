import React, { useEffect, useState, useContext, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import supabase from '../config/supabaseClient';
import { ChevronDown, Menu } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { utente, logout } = useContext(AuthContext);
  const [notificheNonLette, setNotificheNonLette] = useState(0);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const adminRef = useRef(null);

  const isAutenticato = utente && utente.email;
  const isImpresa = utente?.ruolo === 'impresa';
  const isProfessionista = utente?.ruolo === 'professionista';
  const isCommittente = utente?.ruolo === 'committente';
  const isAdmin = utente?.ruolo === 'admin';

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

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
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifiche' }, (payload) => {
        if (payload.new?.email_utente === utente?.email) {
          fetchCount();
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [utente]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (adminRef.current && !adminRef.current.contains(event.target)) {
        setShowAdminMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      {/* Barra blu superiore */}
      <div className="h-1 bg-blue-600" />

      {/* Contenuto principale */}
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-3">
        {/* Logo e toggle mobile */}
        <div className="flex items-center gap-4">
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            <Menu className="w-6 h-6" />
          </button>
          <Link to="/" className="text-lg font-bold text-blue-700 hover:text-blue-900">🏠 Inquotus</Link>
        </div>

        {/* Saluto + logout a destra */}
        {isAutenticato && (
          <div className="hidden md:flex items-center gap-4 ml-auto">
            <span className="text-sm text-gray-700 font-semibold whitespace-nowrap">
              🔐 Benvenuto, <span className="text-blue-700">{utente.nome || 'Utente'}</span> (<em>{utente.ruolo}</em>)
            </span>
            <button
              onClick={handleLogout}
              className="bg-gray-200 text-black px-3 py-1 rounded hover:bg-gray-300 transition font-semibold"
            >
              🔓 Esci
            </button>
          </div>
        )}
      </div>

      {/* Menu principale */}
      <div
        className={`text-sm md:flex md:items-center md:gap-4 px-4 md:px-6 pb-2 ${menuOpen ? 'block' : 'hidden'}`}
      >
        <Link to="/" className="block py-1">🏠 Home</Link>
        <Link to="/richieste-lavoro-in-quota" className="block py-1">🔍 Richieste lavori in quota</Link>
        <Link to="/formazione" className="block py-1">🎓 Formazione</Link>

        {isAutenticato && (
          <>
            {(isCommittente || isImpresa || isProfessionista) && (
              <Link to={`/${isCommittente ? 'home' : utente.ruolo}`} className="block py-1">📂 Area Lavoro</Link>
            )}
            {(isImpresa || isProfessionista) && (
              <>
                <Link to="/sblocchi-effettuati" className="block py-1">🔓 Sblocchi</Link>
                <Link to="/richieste-salvate" className="block py-1">⭐ Salvati</Link>
              </>
            )}
            <Link to="/storico-notifiche" className="relative block py-1">
              📜 Notifiche
              {notificheNonLette > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-600 text-white rounded-full px-2 text-xs font-bold">
                  {notificheNonLette}
                </span>
              )}
            </Link>
            {isCommittente && <Link to="/analytics-richieste" className="block py-1">📊 Analisi richieste</Link>}

            {/* Admin menu */}
            {isAdmin && (
              <div className="relative" ref={adminRef}>
                <button
                  onClick={() => setShowAdminMenu(!showAdminMenu)}
                  className="flex items-center gap-1 font-bold hover:text-blue-600"
                >
                  🛠️ Admin <ChevronDown className={`w-4 h-4 transition ${showAdminMenu ? 'rotate-180' : ''}`} />
                </button>
                {showAdminMenu && (
                  <div className="absolute mt-2 w-56 bg-white border shadow-md rounded-md p-2 z-50 space-y-1">
                    <Link to="/admin/dashboard" className="block px-3 py-1 hover:bg-gray-100 rounded">📊 Dashboard</Link>
                    <Link to="/admin/pagamenti" className="block px-3 py-1 hover:bg-gray-100 rounded">💳 Pagamenti</Link>
                    <Link to="/admin/formazione" className="block px-3 py-1 hover:bg-gray-100 rounded">📚 Iscrizioni</Link>
                    <Link to="/admin/corsi" className="block px-3 py-1 hover:bg-gray-100 rounded">🗂️ Corsi</Link>
                    <Link to="/admin/richieste-lavoro" className="block px-3 py-1 hover:bg-gray-100 rounded">📂 Lavori</Link>
                    <Link to="/admin/utenti" className="block px-3 py-1 hover:bg-gray-100 rounded">👤 Utenti</Link>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {!isAutenticato && (
          <>
            <Link to="/magic-link" className="block py-1">✨ Accesso rapido</Link>
            <Link to="/register/committente" className="block py-1">📝 Registrati</Link>
            <Link to="/login" className="block py-1">🔐 Accedi</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

























