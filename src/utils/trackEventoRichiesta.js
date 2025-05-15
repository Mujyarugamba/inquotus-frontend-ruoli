import supabase from '../config/supabaseClient';

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
