import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

import Login from './auth/Login';
import Register from './auth/Register';
import MagicLinkLogin from './auth/MagicLinkLogin';
import ResetPasswordSupabase from './pages/ResetPasswordSupabase';
import PasswordReset from './pages/PasswordReset';
import ResetPassword from './pages/ResetPassword';

import AdminDashboard from './admin/AdminDashboard';
import AdminPagamenti from './admin/AdminPagamenti';
import RichiesteSospette from './admin/RichiesteSospette';
import AdminNotifiche from './admin/AdminNotifiche';

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
import useRealtimeNotifiche from './hooks/useRealtimeNotifiche';
import Landing from './pages/Landing';

function AppContent() {
  const [utente, setUtente] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUtente(payload);
        // 🔁 Redirect reale in base al ruolo
        if (payload.ruolo === 'committente') navigate('/home');
        else if (payload.ruolo === 'impresa') navigate('/impresa');
        else if (payload.ruolo === 'professionista') navigate('/professionista');
      } catch (err) {
        console.error('Errore parsing token:', err);
      }
    }
    setLoading(false);
  }, [navigate]);

  useRealtimeNotifiche(utente?.email);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '4rem' }}>🔄 Verifica autenticazione...</div>;

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

          <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
          <Route path="/register/:ruolo" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
          <Route path="/magic-link" element={<PublicOnlyRoute><MagicLinkLogin /></PublicOnlyRoute>} />
          <Route path="/reset-password" element={<ResetPasswordSupabase />} />
          <Route path="/password-reset" element={<PasswordReset />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route path="/home" element={<PrivateRoute><Committente /></PrivateRoute>} />
          <Route path="/impresa" element={<PrivateRoute><Impresa /></PrivateRoute>} />
          <Route path="/professionista" element={<PrivateRoute><Professionista /></PrivateRoute>} />

          <Route path="/richiesta/:id" element={<PrivateRoute><DettaglioRichiesta /></PrivateRoute>} />
          <Route path="/nuova-richiesta" element={<PrivateRoute><RichiestaForm /></PrivateRoute>} />
          <Route path="/modifica-richiesta/:id" element={<PrivateRoute><RichiestaModifica /></PrivateRoute>} />
          <Route path="/mie-richieste" element={<PrivateRoute><RichiesteMie /></PrivateRoute>} />

          <Route path="/richieste-lavoro-in-quota" element={<RichiesteLavoroInQuota />} />
          <Route path="/sblocchi-effettuati" element={<PrivateRoute><SblocchiEffettuati /></PrivateRoute>} />
          <Route path="/sblocco-successo" element={<PrivateRoute><SbloccoSuccesso /></PrivateRoute>} />
          <Route path="/sblocco-annullato" element={<PrivateRoute><SbloccoAnnullato /></PrivateRoute>} />

          <Route path="/admin/dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/pagamenti" element={<PrivateRoute><AdminPagamenti /></PrivateRoute>} />
          <Route path="/admin/richieste-sospette" element={<PrivateRoute><RichiesteSospette /></PrivateRoute>} />
          <Route path="/admin/notifiche" element={<PrivateRoute><AdminNotifiche /></PrivateRoute>} />

          <Route path="/storico-notifiche" element={<PrivateRoute><StoricoNotifiche /></PrivateRoute>} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
