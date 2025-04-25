// src/hooks/useApi.js

import { API_BASE } from '../config';

/**
 * Funzione fetch generica per tutte le API.
 * Include log automatici, gestione token e gestione errori standardizzata.
 */
export async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  console.log(`📡 Fetching: ${url}`);

  const token = localStorage.getItem('token'); // 🔐 Legge il token se presente

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }), // 🔐 Include token se esiste
        ...(options.headers || {})
      },
      ...options
    });

    // Controllo errori HTTP
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      console.error('❌ API Error:', errorData);
      throw new Error(errorData.message || 'Errore nella risposta API');
    }

    // Ritorno dati parsati
    const data = await response.json();
    console.log('✅ API Success:', data);
    return data;
  } catch (error) {
    console.error('🚨 Errore API:', error.message);
    throw error;
  }
}
