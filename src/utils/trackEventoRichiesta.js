import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

export const trackEventoRichiesta = async ({ richiestaId, tipoEvento, emailUtente }) => {
  if (!richiestaId || !tipoEvento) return;

  await supabase.from('analytics_richieste').insert([
    {
      richiesta_id: richiestaId,
      tipo_evento: tipoEvento,
      email_utente: emailUtente || null
    }
  ]);
};
