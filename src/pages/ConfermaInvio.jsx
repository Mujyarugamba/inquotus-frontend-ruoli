import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const ConfermaInvio = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-xl w-full text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Richiesta inviata con successo!</h1>
        <p className="text-gray-600 mb-6">Grazie per aver inserito la tua richiesta. Le imprese e i professionisti interessati potranno visualizzarla e contattarti dopo lo sblocco dei contatti.</p>
        <button
          onClick={() => navigate('/home')}
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition"
        >
          Torna alla home
        </button>
      </div>
    </div>
  );
};

export default ConfermaInvio;

