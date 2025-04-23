// ✅ Selezione ambiente tra 'local' e 'render'
const MODE = 'render'; // cambia in 'local' se vuoi testare in locale

const CONFIG = {
  local: 'http://localhost:3002',
  render: 'https://srv-cvukp4h5pdvs73c5sef0.render.com'
};

export const API_BASE = CONFIG[MODE];
