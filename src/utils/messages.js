// src/utils/messages.js

const messages = {
  success: {
    registration: "Benvenuta/o nella tua area personale di Inquotus! Siamo felici di averti con noi.",
    login: "Ciao di nuovo! Buon lavoro su Inquotus.",
    requestSubmitted: "La tua richiesta è stata inviata con successo. Ti aggiorneremo presto!",
    profileUpdated: "Ottimo! Le tue informazioni sono state salvate.",
    contactUnlocked: "Contatto sbloccato! Ora puoi iniziare a collaborare.",
    paymentSuccess: "Grazie per il tuo acquisto! Tutto è andato a buon fine."
  },

  error: {
    registrationFailed: "Ops, qualcosa è andato storto durante la registrazione. Riprova o contattaci, ti aiuteremo subito!",
    loginFailed: "Mh... Email o password non corrette. Prova ancora o recupera la password.",
    dataSaveFailed: "Impossibile salvare i dati per il momento. Riprova tra poco!",
    networkError: "La connessione sembra ballerina. Riprova o controlla la tua rete, noi siamo qui!",
    paymentFailed: "Il pagamento non è andato a buon fine. Nessun addebito effettuato! Puoi riprovare con calma.",
    unauthorizedAccess: "Ops, sembra che tu non abbia accesso a questa pagina. Torniamo all'area principale?"
  },

  info: {
    noOffersYet: "Al momento nessuna proposta su questa richiesta. Ma non ti preoccupare, stiamo avvisando i migliori professionisti!",
    loading: "Un attimo solo... stiamo caricando i dati per te!",
    noResults: "Non abbiamo trovato risultati. Prova a modificare i filtri o aspetta qualche nuovo aggiornamento.",
    documentVerification: "Stiamo controllando i tuoi documenti. Ti avviseremo appena sarà tutto ok!"
  },

  buttons: {
    unlockContacts: "🔓 Sblocca contatti",
    loading: "⏳ Caricamento...",
    reportRequest: "🚩 Segnala richiesta",
    submitReport: "📨 Invia segnalazione",
    viewRequest: "👁️ Visualizza richiesta",
    updatePassword: "🔒 Aggiorna password",
    sendMagicLink: "✉️ Invia Magic Link",
    saveChanges: "💾 Salva modifiche",
    sendRequest: "📩 Invia richiesta",
    register: "📝 Registrati",
    login: "🔑 Accedi",
    logout: "🚪 Esci"
  }
};

export default messages;
