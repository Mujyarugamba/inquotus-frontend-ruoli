import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";

const RichiesteSalvate = () => {
  const { user } = useAuth();
  const [salvate, setSalvate] = useState([]);

  useEffect(() => {
    const fetchSalvate = async () => {
      try {
        const response = await axios.get(`/api/salvati/${user.id}`);
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
    <div className="grid gap-4">
      {salvate.length === 0 ? (
        <p>Nessuna richiesta salvata.</p>
      ) : (
        salvate.map((richiesta) => (
          <div
            key={richiesta.id}
            className="border rounded-xl p-4 shadow-sm hover:shadow-md"
          >
            <h3 className="text-lg font-bold">{richiesta.categoria}</h3>
            <p>{richiesta.localita}</p>
            <p>Inserita il: {new Date(richiesta.data_inserimento).toLocaleDateString()}</p>
            <Link to={`/richiesta/${richiesta.id}`} className="text-blue-600 underline">
              Vai al dettaglio
            </Link>
          </div>
        ))
      )}
    </div>
  );
};

export default RichiesteSalvate;


