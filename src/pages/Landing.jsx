import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Esegui un lavoro in quota in sicurezza</h1>
      <p>Scegli chi sei per iniziare</p>

      <button onClick={() => navigate('/register/committente')}>
        Sono un Committente
      </button>
      <br /><br />
      <button onClick={() => navigate('/register/impresa')}>
        Sono un Impresa
      </button>
      <br /><br />
      <button onClick={() => navigate('/register/professionista')}>
        Sono un Professionista
      </button>
    </div>
  );
};

export default Landing;

