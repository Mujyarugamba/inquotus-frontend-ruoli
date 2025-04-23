const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, 'public', 'data');
const categoriePath = path.join(basePath, 'categorie_raggruppate.json');
const provincePath = path.join(basePath, 'province', 'province-per-regione.json');
const comuniDir = path.join(basePath, 'comuni');

let errori = false;

// ✅ CATEGORIE
if (!fs.existsSync(categoriePath)) {
  console.error('❌ Manca categorie_raggruppate.json');
  errori = true;
} else {
  console.log('✅ categorie_raggruppate.json OK');
}

// ✅ PROVINCE
if (!fs.existsSync(provincePath)) {
  console.error('❌ Manca province-per-regione.json');
  errori = true;
} else {
  console.log('✅ province-per-regione.json OK');

  const provincePerRegione = JSON.parse(fs.readFileSync(provincePath));
  const provinceTotali = Object.values(provincePerRegione).flat();

  // ✅ COMUNI
  if (!fs.existsSync(comuniDir)) {
    console.error('❌ La cartella /comuni non esiste!');
    errori = true;
  } else {
    let mancanti = [];

    provinceTotali.forEach((provincia) => {
      const fileComune = path.join(comuniDir, `${provincia}.json`);
      if (!fs.existsSync(fileComune)) {
        mancanti.push(`${provincia}.json`);
      }
    });

    if (mancanti.length) {
      console.warn(`⚠️ File comuni mancanti (${mancanti.length}):`, mancanti);
      errori = true;
    } else {
      console.log('✅ Tutti i file comuni presenti');
    }
  }
}

if (!errori) {
  console.log('🎉 Tutti i file necessari sono presenti!');
} else {
  console.warn('⚠️ Alcuni file sono mancanti o da sistemare.');
}
