// src/supabaseTest.js
import React, { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Ottieni le variabili di ambiente
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Inizializza Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const SupabaseTest = () => {

  // Esegui la query al momento del montaggio del componente
  useEffect(() => {
    // Funzione per eseguire la query
    const fetchData = async () => {
      // Modifica 'your_table_name' con il nome della tua tabella su Supabase
      const { data, error } = await supabase
        .from('your_table_name')  // Sostituisci con il nome della tua tabella
        .select('*');  // Seleziona tutte le colonne

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        console.log('Fetched data:', data);
      }
    };

    // Chiama la funzione di fetch
    fetchData();
  }, []);

  return (
    <div>
      <h1>Test Supabase Client</h1>
      <p>Check the console for fetched data.</p>
    </div>
  );
};

export default SupabaseTest;


