# Zero Trust Setup für Ollama API

## 🎯 Ziel
Sichere deine Ollama API (`api.just-fit.org`) mit Cloudflare Zero Trust Service Authentication.

## ✅ Deine Konfiguration - Review

### Was richtig ist:
1. ✅ Service Token für Backend-Authentifizierung
2. ✅ Self-hosted Application für `api.just-fit.org`
3. ✅ Service Auth Policy
4. ✅ Non-expiring Token (gut für Backend)

### ⚠️ Was angepasst werden muss:

#### 1. Tunnel Configuration muss aktualisiert werden

Der Tunnel muss wissen, dass er Zero Trust verwenden soll. Update deine `~/.cloudflared/config.yml`:

```yaml
tunnel: <DEIN_TUNNEL_ID>
credentials-file: /Users/danielrajanigl/.cloudflared/<TUNNEL_ID>.json

ingress:
  - hostname: api.just-fit.org
    service: http://localhost:11434
    originRequest:
      access:
        required: true
        teamName: <DEIN_TEAM_NAME>  # Findest du in Zero Trust Dashboard
  - service: http_status:404
```

**Wichtig:** Ohne diese `access.required: true` Konfiguration funktioniert Zero Trust nicht!

#### 2. Code muss Authentication Headers senden

Der Ollama Client muss die Service Token Headers mitsenden. Das muss im Code angepasst werden.

## 📋 Schritt-für-Schritt Setup

### Schritt 1: Service Token erstellen ✅

1. Gehe zu: https://one.dash.cloudflare.com/3cb641b7f5e5c103da17e3055c5d6fb0/access/service-auth
2. "Create Service Token"
3. Name: "Backend API Token"
4. Duration: "Non-expiring"
5. **WICHTIG:** Speichere Client ID + Client Secret sofort! (wird nur 1x angezeigt)

### Schritt 2: Access Application erstellen ✅

1. Gehe zu: https://one.dash.cloudflare.com/3cb641b7f5e5c103da17e3055c5d6fb0/access/apps
2. "Add an application" → "Self-hosted"
3. Application domain: `api.just-fit.org`
4. Next
5. Policy name: "Allow Backend Only"
6. Action: "Service Auth"
7. Include: "Service Token" → Wähle dein Token
8. Save

### Schritt 3: Tunnel Config aktualisieren ⚠️ WICHTIG

**Finde dein Team Name:**
- Gehe zu Zero Trust Dashboard
- Oben rechts siehst du deinen Team Name (z.B. `your-team.cloudflareaccess.com`)

**Update `~/.cloudflared/config.yml`:**

```yaml
tunnel: <DEIN_TUNNEL_ID>
credentials-file: /Users/danielrajanigl/.cloudflared/<TUNNEL_ID>.json

ingress:
  - hostname: api.just-fit.org
    service: http://localhost:11434
    originRequest:
      access:
        required: true
        teamName: <DEIN_TEAM_NAME>  # z.B. "your-team"
  - service: http_status:404
```

**Tunnel neu starten:**
```bash
# Tunnel stoppen (Ctrl+C)
# Dann neu starten:
cloudflared tunnel run ollama-tunnel
```

### Schritt 4: Environment Variables setzen

Füge zu `apps/web/.env.local` hinzu:

```bash
OLLAMA_HOST=https://api.just-fit.org
CF_ACCESS_CLIENT_ID=<DEINE_CLIENT_ID>
CF_ACCESS_CLIENT_SECRET=<DEIN_CLIENT_SECRET>
```

### Schritt 5: Code anpassen ✅ (BEREITS GEMACHT)

Der Code wurde bereits angepasst! Der Ollama Client sendet automatisch die Cloudflare Access Headers, wenn `CF_ACCESS_CLIENT_ID` und `CF_ACCESS_CLIENT_SECRET` gesetzt sind.

**Datei:** `packages/ai/src/model.ts`
- Erkennt automatisch, ob Zero Trust Credentials vorhanden sind
- Fügt die Headers `CF-Access-Client-Id` und `CF-Access-Client-Secret` zu allen Requests hinzu
- Funktioniert transparent - keine weiteren Code-Änderungen nötig!

## 🧪 Testen

### Test 1: Ohne Token (sollte fehlschlagen)
```bash
curl https://api.just-fit.org/api/tags
# Sollte: 403 Forbidden zurückgeben
```

### Test 2: Mit Token (sollte funktionieren)
```bash
curl https://api.just-fit.org/api/tags \
  -H "CF-Access-Client-Id: <CLIENT-ID>" \
  -H "CF-Access-Client-Secret: <CLIENT-SECRET>"
# Sollte: Ollama Response zurückgeben
```

## 🔒 Sicherheit

✅ **Gut:** Service Token ist non-expiring (keine Unterbrechungen)  
✅ **Gut:** Nur Backend kann auf API zugreifen  
⚠️ **Wichtig:** Client Secret niemals in Git committen!  
⚠️ **Wichtig:** Nur in `.env.local` oder Production Environment Variables speichern

## 📝 Zusammenfassung

Deine Konfiguration ist **fast richtig**, aber:

1. ✅ Service Token Setup - **Korrekt**
2. ✅ Access Application Setup - **Korrekt**
3. ⚠️ Tunnel Config - **Muss `access.required: true` haben** (Schritt 3)
4. ✅ Code - **Bereits angepasst!** Headers werden automatisch gesendet

## 🚀 Nächste Schritte

1. Tunnel Config aktualisieren (Schritt 3)
2. Environment Variables setzen (Schritt 4)
3. Code anpassen (siehe nächste Datei)
4. Testen

