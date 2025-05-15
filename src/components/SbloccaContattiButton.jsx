import React, { useState } from 'react';
import { API_BASE } from '../config';
import { toast } from 'react-hot-toast'; // ✅ Importato toast

const SbloccaContattiButton = ({ richiestaId }) => {
  const [caricamento, setCaricamento] = useState(false);

  const handleClick = async () => {
    setCaricamento(true);
    try {
      const res = await fetch(`${API_BASE}/api/sblocca/${richiestaId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await res.json();

      if (res.ok && data.sessionUrl) {
        window.location.href = data.sessionUrl; // reindirizza a Stripe Checkout
      } else {
        toast.error(data.error || '❌ Errore durante la creazione della sessione di pagamento.');
      }
    } catch (err) {
      console.error(err);
      toast.error('❌ Errore di rete durante la creazione della sessione Stripe.');
    } finally {
      setCaricamento(false);
    }
  };

  return (
    <button onClick={handleClick} disabled={caricamento}>
      {caricamento ? '⏳ Caricamento...' : '🔓 Sblocca contatti'}
    </button>
  );
};

export default SbloccaContattiButton;

