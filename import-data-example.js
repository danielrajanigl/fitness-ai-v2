/**
 * Einfaches Beispiel-Script zum Importieren von JSON-Daten via API
 * 
 * Usage:
 *   1. Starte Dev-Server: npm run dev
 *   2. Führe dieses Script aus: node import-data-example.js
 */

const fs = require('fs');
const path = require('path');

async function importData() {
  // 1. JSON-Datei lesen (ändere den Pfad zu deiner Datei)
  const jsonFilePath = process.argv[2] || 'food_category_translated_20251123_162633.json';
  const dataType = process.argv[3] || 'food';
  const userId = process.argv[4] || '69b81e79-0be4-477b-bf77-0e0fb39a02dd';

  console.log(`📦 Lese JSON-Datei: ${jsonFilePath}`);
  
  let jsonData;
  try {
    const filePath = path.resolve(jsonFilePath);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    jsonData = JSON.parse(fileContent);
    
    if (!Array.isArray(jsonData)) {
      console.error('❌ JSON-Datei muss ein Array enthalten');
      process.exit(1);
    }
  } catch (error) {
    console.error(`❌ Fehler beim Lesen der JSON-Datei: ${error.message}`);
    process.exit(1);
  }

  console.log(`✅ ${jsonData.length} Items gefunden`);
  console.log(`📝 Data Type: ${dataType}`);
  console.log(`👤 User ID: ${userId}`);
  console.log(`🚀 Sende Daten an API...\n`);

  // 2. An API senden
  try {
    const response = await fetch('http://localhost:3000/api/data/import-json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonData: jsonData,
        dataType: dataType,
        user_id: userId
      })
    });

    const result = await response.json();

    if (result.success) {
      console.log(`\n✅ Import erfolgreich!`);
      console.log(`   Erfolgreich importiert: ${result.imported}`);
      console.log(`   Fehlgeschlagen: ${result.failed}`);
      console.log(`   Gesamt: ${result.total}`);
      
      if (result.errors && result.errors.length > 0) {
        console.log(`\n⚠️  Fehler:`);
        result.errors.forEach((error, index) => {
          console.log(`   ${index + 1}. ${error}`);
        });
      }
    } else {
      console.error(`\n❌ Import fehlgeschlagen: ${result.error}`);
      if (result.stack) {
        console.error(result.stack);
      }
      process.exit(1);
    }
  } catch (error) {
    console.error(`\n❌ Fehler beim API-Aufruf: ${error.message}`);
    console.error(`   Stelle sicher, dass der Dev-Server läuft: npm run dev`);
    process.exit(1);
  }
}

// Ausführen
importData();

