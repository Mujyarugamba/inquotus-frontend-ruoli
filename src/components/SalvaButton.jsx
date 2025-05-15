import { Star, StarOff } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import supabase from '../config/supabaseClient';


const SalvaButton = ({ richiestaId, userId }) => {
  const [salvata, setSalvata] = useState(false);
  const [salvataggioId, setSalvataggioId] = useState(null);

  useEffect(() => {
    const checkSalvata = async () => {
      const { data, error } = await supabase
        .from('richieste_salvate')
        .select('id')
        .eq('richiesta_id', richiestaId)
        .eq('utente_id', userId)
        .single();

      if (data) {
        setSalvata(true);
        setSalvataggioId(data.id);
      } else {
        setSalvata(false);
        setSalvataggioId(null);
      }
    };

    if (userId && richiestaId) checkSalvata();
  }, [userId, richiestaId]);

  const toggleSalvataggio = async () => {
    if (salvata && salvataggioId) {
      const { error } = await supabase
        .from('richieste_salvate')
        .delete()
        .eq('id', salvataggioId);

      if (!error) {
        setSalvata(false);
        setSalvataggioId(null);
        toast.info('Richiesta rimossa dai salvati.');
      } else {
        console.error(error);
        toast.error('Errore nella rimozione.');
      }
    } else {
      const { data, error } = await supabase
        .from('richieste_salvate')
        .insert([{ richiesta_id: richiestaId, utente_id: userId }]);

      if (!error) {
        setSalvata(true);
        setSalvataggioId(data?.[0]?.id || null);
        toast.success('Richiesta salvata!');
      } else {
        console.error(error);
        toast.error('Errore nel salvataggio.');
      }
    }
  };

  return (
    <button
      onClick={toggleSalvataggio}
      className={`flex items-center gap-1 border px-2 py-1 rounded text-sm transition-all ${
        salvata ? 'bg-yellow-100 border-yellow-500 text-yellow-700' : 'bg-gray-100 border-gray-300 text-gray-600'
      }`}
    >
      {salvata ? <Star size={16} fill="gold" /> : <StarOff size={16} />}
      {salvata ? 'Salvata' : 'Salva'}
    </button>
  );
};

export default SalvaButton;


