// Cambia tra 'local' e 'render' quando vuoi
export const API_BASE = 'https://srv-cvukp4h5pdvs73c5sef0.render.com';

const MODE = 'local'; // oppure 'render'

const CONFIG = {
  local: 'http://localhost:3002',
  render: 'https://inquotus-backend-auth.onrender.com'
};

export const API_BASE = CONFIG[MODE];
