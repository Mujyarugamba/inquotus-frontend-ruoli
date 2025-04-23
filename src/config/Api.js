// Cambia tra 'local' e 'render' quando vuoi
const MODE = 'local'; // oppure 'render'

const CONFIG = {
  local: 'http://localhost:3002',
  render: 'https://inquotus-backend-auth.onrender.com'
};

export const API_BASE = CONFIG[MODE];
