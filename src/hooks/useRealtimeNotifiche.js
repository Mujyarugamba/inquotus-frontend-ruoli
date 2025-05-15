import { useEffect } from 'react';
import supabase from '../config/supabaseClient';
import { toast } from 'react-toastify';

const useRealtimeNotifiche = (utenteEmail) => {
  useEffect(() => {
    if (!utenteEmail || typeof utenteEmail !== 'string') {
      console.warn('Email utente non valida:', utenteEmail);
      return;
    }

    console.log('Inizializzo real-time notifiche per:', utenteEmail);

    let channel;
    try {
      channel = supabase
        .channel('notifiche-realtime')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifiche',
            filter: `email=eq.${utenteEmail}`
          },
          (payload) => {
            console.log('Payload ricevuto:', payload);
            if (payload?.new) {
              const messaggio = payload.new.messaggio || '🔔 Hai una nuova notifica!';
              toast.info(messaggio);
            }
          }
        )
        .subscribe();
    } catch (error) {
      console.error('Errore nella sottoscrizione al canale:', error);
    }

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
        console.log('Canale rimosso correttamente.');
      }
    };
  }, [utenteEmail]);
};

export default useRealtimeNotifiche;