const fs = require('fs');
const path = require('path');

const italy = require('./italy.json'); // assicurati che il file sia nella stessa cartella

const baseDir = path.join(__dirname, 'public', 'data');
const comuniDir = path.join(baseDir, 'comuni');
const provinceDir = path.join(baseDir, 'province');

fs.mkdirSync(comuniDir, { recursive: true });
fs.mkdirSync(provinceDir, { recursive: true });

const regioniMap = {};

italy.forEach(item => {
  if (!item?.regione?.nome || !item?.provincia?.nome || !item?.nome) return;

  const regione = item.regione.nome;
  const provincia = item.provincia.nome;
  const comune = item.nome;

  if (!regioniMap[regione]) {
    regioniMap[regione] = {};
  }

  if (!regioniMap[regione][provincia]) {
    regioniMap[regione][provincia] = [];
  }

  regioniMap[regione][provincia].push(comune);
});

Object.entries(regioniMap).forEach(([regione, province]) => {
  const provinceList = Object.keys(province).sort();
  const regioneFile = path.join(provinceDir, `${regione}.json`);
  fs.writeFileSync(regioneFile, JSON.stringify(provinceList, null, 2));

  Object.entries(province).forEach(([provincia, comuni]) => {
    const safeName = provincia.replace(/[\\/:"*?<>|]+/g, '_');
    const filePath = path.join(comuniDir, `${safeName}.json`);
    fs.writeFileSync(filePath, JSON.stringify(comuni.sort(), null, 2));
  });
});

console.log('✅ Dati salvati in /public/data (province + comuni)');
