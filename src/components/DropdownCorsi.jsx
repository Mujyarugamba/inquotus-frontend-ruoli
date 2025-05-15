import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DropdownCorsi = () => {
  const [corsi, setCorsi] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCorsi = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/corsi');
        const data = await response.json();
        setCorsi(data);
      } catch (error) {
        console.error('Errore nel recupero dei corsi:', error);
      }
    };

    fetchCorsi();
  }, []);

  const handleSelect = (corso) => {
    navigate(`/richiedi-corso?corso=${encodeURIComponent(corso.titolo)}&modalita=${encodeURIComponent(corso.modalita)}`);
  };

  return (
    <div className="dropdown">
      <button
        className="btn btn-primary dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        🎓 Seleziona un corso
      </button>
      <ul className="dropdown-menu">
        {corsi.map((corso) => (
          <li key={corso.id}>
            <button
              className="dropdown-item"
              onClick={() => handleSelect(corso)}
            >
              {corso.titolo} ({corso.modalita})
            </button>
          </li>
        ))}
        {corsi.length === 0 && (
          <li>
            <span className="dropdown-item disabled">Nessun corso disponibile</span>
          </li>
        )}
      </ul>
    </div>
  );
};

export default DropdownCorsi;

