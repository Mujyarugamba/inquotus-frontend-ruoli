import supabase from '../config/supabaseClient';

/**
 * Salva una notifica personalizzata su Supabase.
 * @param {Object} options
 * @param {string} options.email_utente - Email destinatario
 * @param {string} options.tipo - Tipo evento (INSERT, UPDATE, DELETE, ecc.)
 * @param {string} options.descrizione - Messaggio della notifica
 */
export async function salvaNotifica({ email_utente, tipo, descrizione }) {
  if (!email_utente || !tipo || !descrizione) {
    console.warn('salvaNotifica: parametri incompleti');
    return;
  }

  const { error } = await supabase.from('notifiche').insert([
    {
      email_utente,
      tipo,
      descrizione,
      letto: false,
      timestamp: new Date().toISOString()
    }
  ]);

  if (error) {
    console.error('Errore nel salvataggio della notifica:', error.message);
  }
}
