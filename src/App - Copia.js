import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';

import Login from './auth/Login';
import Register from './auth/Register';
import MagicLinkLogin from './auth/MagicLinkLogin';
import VerificaEmail from './auth/VerificaEmail';
import ResetPasswordSupabase from './pages/ResetPasswordSupabase';
import PasswordReset from './pages/PasswordReset';
import ResetPassword from './pages/ResetPassword';

import AdminUtenti from './admin/AdminUtenti';
import AdminDashboard from './admin/AdminDashboard';
import AdminPagamenti from './admin/AdminPagamenti';
import RichiesteSospette from './admin/RichiesteSospette';
import AdminNotifiche from './admin/AdminNotifiche';
import AdminIscrizioniFormazione from './admin/AdminIscrizioniFormazione';
import AdminCorsi from './admin/AdminCorsi';
import AdminRichiesteLavoro from './admin/AdminRichiesteLavoro';

import RichiesteMie from './richieste/RichiesteMie';
import Committente from './ruoli/Committente';
import Impresa from './ruoli/Impresa';
import Professionista from './ruoli/Professionista';
import DettaglioRichiesta from './richieste/DettaglioRichiesta';
import RichiestaForm from './richieste/RichiestaForm';
import RichiestaModifica from './richieste/RichiestaModifica';
import RichiesteLavoroInQuota from './richieste/RichiesteLavoroInQuota';
import SblocchiEffettuati from './ruoli/SblocchiEffettuati';

import PrivateRoute from './routes/PrivateRoute';
import PublicOnlyRoute from './routes/PublicOnlyRoute';
import SbloccoSuccesso from './pages/SbloccoSuccesso';
import SbloccoAnnullato from './pages/SbloccoAnnullato';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import StoricoNotifiche from './notifiche/StoricoNotifiche';
import Landing from './pages/Landing';
import Errore404 from './pages/Errore404';
import Formazione from './pages/Formazione';
import CorsoDettaglio from './pages/CorsoDettaglio';

import { AuthProvider, AuthContext } from './context/AuthContext';
import useRealtimeNotifiche from './hooks/useRealtimeNotifiche';

function AppContent() {
  const { utente } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Breve delay per dare tempo al context di inizializzarsi
    const timeout = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timeout);
  }, []);

  useRealtimeNotifiche(utente?.email);

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '4rem' }}>🔄 Verifica autenticazione...</div>;
  }

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '80vh' }}>
        <Routes>
          <Route
            path="/"
            element={
              utente ? (
                utente.ruolo === 'committente' ? (
                  <Committente />
                ) : utente.ruolo === 'impresa' ? (
                  <Impresa />
                ) : (
                  <Professionista />
                )
              ) : (
                <Landing />
              )
            }
          />

          {/* --- ADMIN --- */}
          <Route path="/admin/dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/pagamenti" element={<PrivateRoute><AdminPagamenti /></PrivateRoute>} />
          <Route path="/admin/richieste-sospette" element={<PrivateRoute><RichiesteSospette /></PrivateRoute>} />
          <Route path="/admin/notifiche" element={<PrivateRoute><AdminNotifiche /></PrivateRoute>} />
          <Route path="/admin/formazione" element={<PrivateRoute><AdminIscrizioniFormazione /></PrivateRoute>} />
          <Route path="/admin/corsi" element={<PrivateRoute><AdminCorsi /></PrivateRoute>} />
          <Route path="/admin/richieste-lavoro" element={<PrivateRoute><AdminRichiesteLavoro /></PrivateRoute>} />
          <Route path="/admin/utenti" element={<PrivateRoute><AdminUtenti /></PrivateRoute>} />

          {/* --- AUTHENTICATION --- */}
          <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
          <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
          <Route path="/register/:ruolo" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
          <Route path="/magic-link" element={<PublicOnlyRoute><MagicLinkLogin /></PublicOnlyRoute>} />
          <Route path="/verifica-email" element={<PublicOnlyRoute><VerificaEmail /></PublicOnlyRoute>} />
          <Route path="/reset-password" element={<ResetPasswordSupabase />} />
          <Route path="/password-reset" element={<PasswordReset />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* --- PRIVATE AREA --- */}
          <Route path="/home" element={<PrivateRoute><Committente /></PrivateRoute>} />
          <Route path="/impresa" element={<PrivateRoute><Impresa /></PrivateRoute>} />
          <Route path="/professionista" element={<PrivateRoute><Professionista /></PrivateRoute>} />
          <Route path="/richiesta/:slug" element={<PrivateRoute><DettaglioRichiesta /></PrivateRoute>} />
          <Route path="/nuova-richiesta" element={<PrivateRoute><RichiestaForm /></PrivateRoute>} />
          <Route path="/modifica-richiesta/:id" element={<PrivateRoute><RichiestaModifica /></PrivateRoute>} />
          <Route path="/mie-richieste" element={<PrivateRoute><RichiesteMie /></PrivateRoute>} />

          {/* --- FREE AREA --- */}
          <Route path="/richieste-lavoro-in-quota" element={<RichiesteLavoroInQuota />} />
          <Route path="/sblocchi-effettuati" element={<PrivateRoute><SblocchiEffettuati /></PrivateRoute>} />
          <Route path="/sblocco-successo" element={<PrivateRoute><SbloccoSuccesso /></PrivateRoute>} />
          <Route path="/sblocco-annullato" element={<PrivateRoute><SbloccoAnnullato /></PrivateRoute>} />
          <Route path="/formazione" element={<Formazione />} />
          <Route path="/corso/:slug" element={<CorsoDettaglio />} />

          {/* --- NOTIFICHE --- */}
          <Route path="/storico-notifiche" element={<PrivateRoute><StoricoNotifiche /></PrivateRoute>} />

          {/* --- 404 --- */}
          <Route path="*" element={<Errore404 />} />
        </Routes>
      </div>
      <Footer />
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

function App() {
  return (
    <HelmetProvider>
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;
