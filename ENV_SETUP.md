# Environment Variables Setup

## 📍 Wichtiger Hinweis

**Alle Environment Variables müssen in `apps/web/.env.local` gespeichert werden!**

Next.js lädt automatisch `.env.local` Dateien. Diese Datei wird nicht in Git committed (siehe `.gitignore`).

## 🔐 Erforderliche Variablen

### Ollama Configuration
```bash
OLLAMA_HOST=https://llm.just-fit.org
```

### Cloudflare Zero Trust (Optional, aber empfohlen)
```bash
CF_ACCESS_CLIENT_ID=your_client_id_here
CF_ACCESS_CLIENT_SECRET=your_client_secret_here
```

### Supabase Configuration
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## 📂 Datei-Location

**Wichtig:** Die Datei muss hier sein:
```
apps/web/.env.local
```

**NICHT** in:
- ❌ Root `.env.local` (wird nicht geladen)
- ❌ `apps/web/.env` (wird geladen, aber `.env.local` hat Priorität)

## 🔄 Nach Änderungen

Nach dem Ändern von `.env.local`:
1. **Dev Server neu starten:**
   ```bash
   # Stop: Ctrl+C
   npm run dev
   ```

2. **Prüfen ob Variablen geladen wurden:**
   - Besuche: `http://localhost:3000/api/test-ollama-connection`
   - Sollte `ollamaHost` und `hasZeroTrust` anzeigen

## ✅ Aktuelle Konfiguration

Die Variablen werden automatisch von Next.js geladen:
- `process.env.OLLAMA_HOST` ✅
- `process.env.CF_ACCESS_CLIENT_ID` ✅
- `process.env.CF_ACCESS_CLIENT_SECRET` ✅

Der Code verwendet diese Variablen korrekt in:
- `packages/ai/src/model.ts`
- `apps/web/app/api/test-ollama-connection/route.ts`
- Alle anderen API-Routen

## 🚨 Troubleshooting

**Problem:** Variablen werden nicht geladen
- ✅ Prüfe: Datei ist in `apps/web/.env.local`
- ✅ Prüfe: Keine Tippfehler in Variablennamen
- ✅ Prüfe: Dev Server wurde neu gestartet
- ✅ Prüfe: Keine Leerzeichen um `=` Zeichen

**Problem:** Zero Trust funktioniert nicht
- ✅ Prüfe: Beide Variablen sind gesetzt
- ✅ Prüfe: Keine Anführungszeichen um die Werte
- ✅ Prüfe: Tunnel Config hat `access.required: true`


