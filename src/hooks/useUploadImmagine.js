import { useState } from 'react';
import supabase from '../config/supabaseClient';

const MAX_SIZE_MB = 3;
const ALLOWED_TYPES = ['image/jpeg', 'image/png'];

const useUploadImmagine = () => {
  const [progress, setProgress] = useState(0);

  const upload = async (file, emailUtente) => {
    setProgress(0); // Reset progress ad ogni nuovo upload

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

    // Simuliamo progresso manuale durante upload (perché Supabase non dà eventi progress)
    let fakeProgress = 0;
    const interval = setInterval(() => {
      fakeProgress += 10;
      setProgress(prev => Math.min(prev + 10, 90));
    }, 200); // ogni 200ms aumentiamo del 10%

    const { data, error } = await supabase.storage
      .from('richieste')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      });

    clearInterval(interval); // Stop incremento

    if (error) {
      console.error('Errore upload immagine:', error);
      setProgress(0);
      return { url: '', error: 'Errore durante l\'upload.' };
    }

    const { data: publicUrlData } = supabase
      .storage
      .from('richieste')
      .getPublicUrl(fileName);

    setProgress(100); // Completato!

    return { url: publicUrlData?.publicUrl || '', error: null };
  };

  return { upload, progress, setProgress };
};

export default useUploadImmagine;
