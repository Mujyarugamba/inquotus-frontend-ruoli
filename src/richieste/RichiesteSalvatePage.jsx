import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";

const RichiesteSalvatePage = () => {
  const { user } = useAuth();
  const [salvate, setSalvate] = useState([]);

  useEffect(() => {
    const fetchSalvate = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE}/api/salvati/${user.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setSalvate(response.data);
      } catch (err) {
        console.error("Errore nel recupero delle richieste salvate:", err);
      }
    };

    if (user?.id) {
      fetchSalvate();
    }
  }, [user]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">⭐ Richieste salvate</h1>
      {salvate.length === 0 ? (
        <p>Nessuna richiesta salvata al momento.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {salvate.map((richiesta) => (
            <div
              key={richiesta.id}
              className="border rounded-xl p-4 shadow-sm bg-white hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold mb-1">{richiesta.categoria}</h3>
              <p className="text-sm text-gray-600">{richiesta.localita} – {richiesta.provincia}</p>
              <p className="text-xs text-gray-500 mb-2">
                Inserita il {new Date(richiesta.data_inserimento).toLocaleDateString()}
              </p>
              <Link
                to={`/richiesta/${richiesta.id}`}
                className="text-blue-600 hover:underline text-sm"
              >
                Vai al dettaglio →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RichiesteSalvatePage;
