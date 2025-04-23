// src/config.test.js
const MODE = 'render'; // ✅ corrisponde al tuo backend attivo

const CONFIG = {
  local: 'http://localhost:5000',
  render: 'https://inquotus-backend-auth.onrender.com',
  test: 'http://localhost:5001',
  mock: 'https://mockapi.io/fake-inquotus'
};

export const API_BASE = CONFIG[MODE];

