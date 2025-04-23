import { supabase } from '../config/supabaseClient';

const MAX_SIZE_MB = 3;
const ALLOWED_TYPES = ['image/jpeg', 'image/png'];

const useUploadImmagine = () => {
  const upload = async (file, emailUtente) => {
    if (!file || !emailUtente) return { url: '', error: 'File o utente non valido.' };

    // Validazione formato
    if (!ALLOWED_TYPES.includes(file.type)) {
      return { url: '', error: 'Formato non supportato. Usa JPEG o PNG.' };
    }

    // Validazione dimensione
    const maxBytes = MAX_SIZE_MB * 1024 * 1024;
    if (file.size > maxBytes) {
      return { url: '', error: `Il file supera i ${MAX_SIZE_MB}MB.` };
    }

    const timestamp = Date.now();
    const fileName = `${emailUtente}/${timestamp}-${file.name}`;

    const { data, error } = await supabase.storage
      .from('richieste')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.error('Errore upload immagine:', error);
      return { url: '', error: 'Errore durante l\'upload.' };
    }

    const { data: publicUrlData } = supabase
      .storage
      .from('richieste')
      .getPublicUrl(fileName);

    return { url: publicUrlData?.publicUrl || '', error: null };
  };

  return { upload };
};

export default useUploadImmagine;
