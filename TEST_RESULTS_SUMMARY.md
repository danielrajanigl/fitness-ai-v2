# Test Setup für llm.just-fit.org

## ✅ Was wurde gemacht

1. **Environment Variable aktualisiert:**
   - `OLLAMA_HOST=https://llm.just-fit.org` in `apps/web/.env.local`

2. **Umfassender Test-Endpunkt erstellt:**
   - `/api/test-ollama-connection` - Führt 3 Tests durch:
     - Direct URL Test (prüft ob API erreichbar ist)
     - Embedding Test (testet unsere embed Funktion)
     - Chat Test (testet unsere runChat Funktion)

## 🧪 Tests durchführen

### Option 1: Via Browser/API
```
http://localhost:3000/api/test-ollama-connection
```

### Option 2: Via curl
```bash
curl http://localhost:3000/api/test-ollama-connection
```

## 📊 Was die Tests prüfen

### Test 1: Direct URL Test
- Prüft ob `llm.just-fit.org/api/tags` erreichbar ist
- Sendet automatisch Zero Trust Headers (wenn gesetzt)
- Zeigt HTTP Status und Response Preview

### Test 2: Embedding Test
- Testet unsere `embed()` Funktion
- Prüft ob Embeddings generiert werden können
- Zeigt Embedding Dimension (sollte 4096 sein)

### Test 3: Chat Test
- Testet unsere `runChat()` Funktion
- Sendet eine Test-Nachricht
- Prüft ob Response zurückkommt

## ⚠️ Wichtige Hinweise

### Zero Trust Status
Der curl-Test zeigt, dass Zero Trust aktiv ist (Cloudflare Access Error Page).

**Wenn Zero Trust Credentials fehlen:**
- Die Tests werden fehlschlagen mit 403/401 Fehlern
- Füge zu `apps/web/.env.local` hinzu:
  ```bash
  CF_ACCESS_CLIENT_ID=<DEINE_CLIENT_ID>
  CF_ACCESS_CLIENT_SECRET=<DEIN_CLIENT_SECRET>
  ```

### Dev Server neu starten
Nach Änderungen an `.env.local`:
```bash
# Stop: Ctrl+C
npm run dev
```

## 📝 Erwartete Ergebnisse

### Mit Zero Trust Credentials:
```json
{
  "timestamp": "...",
  "ollamaHost": "https://llm.just-fit.org",
  "hasZeroTrust": true,
  "tests": [
    {
      "name": "Direct URL Test",
      "success": true,
      "status": 200
    },
    {
      "name": "Embedding Test",
      "success": true,
      "dimension": 4096
    },
    {
      "name": "Chat Test",
      "success": true,
      "responsePreview": "Hello..."
    }
  ],
  "overall": {
    "success": true,
    "passed": 3,
    "total": 3
  }
}
```

### Ohne Zero Trust Credentials:
```json
{
  "hasZeroTrust": false,
  "tests": [
    {
      "name": "Direct URL Test",
      "success": false,
      "status": 403
    }
  ]
}
```

## 🔧 Nächste Schritte

1. **Dev Server neu starten** (wenn noch nicht geschehen)
2. **Test-Endpunkt aufrufen:** `http://localhost:3000/api/test-ollama-connection`
3. **Ergebnisse prüfen** - Alle 3 Tests sollten erfolgreich sein
4. **Falls Fehler:** Prüfe ob Zero Trust Credentials gesetzt sind

## 🎯 Status

- ✅ URL aktualisiert: `llm.just-fit.org`
- ✅ Test-Endpunkt erstellt
- ⚠️ Zero Trust Credentials prüfen (falls Tests fehlschlagen)

