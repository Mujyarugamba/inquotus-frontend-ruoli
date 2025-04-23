const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'public', 'data');
const regioniPath = path.join(baseDir, 'regioni.json');
const provinceDir = path.join(baseDir, 'province');
const comuniDir = path.join(baseDir, 'comuni');

// Funzione utility
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function logStatus(label, exists) {
  const symbol = exists ? '✅' : '❌';
  console.log(`${symbol} ${label}`);
}

console.log('\n🧪 Verifica file in /public/data\n');

// Verifica regioni
logStatus('regioni.json', fileExists(regioniPath));

// Verifica province
let regioni = [];
if (fileExists(regioniPath)) {
  regioni = JSON.parse(fs.readFileSync(regioniPath));
  regioni.forEach(reg => {
    const provPath = path.join(provinceDir, `${reg}.json`);
    logStatus(`province/${reg}.json`, fileExists(provPath));
  });
}

// Verifica comuni (solo se i file province esistono)
if (regioni.length) {
  regioni.forEach(reg => {
    const provPath = path.join(provinceDir, `${reg}.json`);
    if (fileExists(provPath)) {
      const province = JSON.parse(fs.readFileSync(provPath));
      province.forEach(p => {
        const comunePath = path.join(comuniDir, `${p}.json`);
        logStatus(`comuni/${p}.json`, fileExists(comunePath));
      });
    }
  });
}

console.log('\n🔍 Controllo completato.\n');
