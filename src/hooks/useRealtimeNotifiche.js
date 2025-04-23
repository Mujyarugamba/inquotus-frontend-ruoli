import { useEffect } from 'react';
import { supabase } from '../config/supabaseClient';
import { toast } from 'react-toastify';

const useRealtimeNotifiche = (utenteEmail) => {
  useEffect(() => {
    if (!utenteEmail) return;

    const channel = supabase
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
          const messaggio = payload.new?.messaggio || '🔔 Hai una nuova notifica!';
          toast.info(messaggio);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [utenteEmail]);
};

export default useRealtimeNotifiche;
