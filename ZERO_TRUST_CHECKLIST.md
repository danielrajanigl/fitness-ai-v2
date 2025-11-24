# Zero Trust Setup Checklist für api.just-fit.org

## ✅ Was bereits gemacht wurde

- [x] Code angepasst - Ollama Client sendet automatisch CF-Access Headers
- [x] Dokumentation erstellt

## 📋 Was du noch machen musst

### 1. Service Token erstellen
- [ ] Gehe zu: https://one.dash.cloudflare.com/3cb641b7f5e5c103da17e3055c5d6fb0/access/service-auth
- [ ] "Create Service Token"
- [ ] Name: "Backend API Token"
- [ ] Duration: "Non-expiring"
- [ ] **SPEICHERE Client ID + Client Secret sofort!**

### 2. Access Application erstellen
- [ ] Gehe zu: https://one.dash.cloudflare.com/3cb641b7f5e5c103da17e3055c5d6fb0/access/apps
- [ ] "Add an application" → "Self-hosted"
- [ ] Application domain: `api.just-fit.org`
- [ ] Policy: "Allow Backend Only"
- [ ] Action: "Service Auth"
- [ ] Include: Dein Service Token
- [ ] Save

### 3. Team Name finden
- [ ] Gehe zu Zero Trust Dashboard
- [ ] Oben rechts: Team Name notieren (z.B. `your-team`)
- [ ] Oder in URL: `https://one.dash.cloudflare.com/<TEAM_ID>/...`

### 4. Tunnel Config aktualisieren ⚠️ KRITISCH
- [ ] Öffne: `~/.cloudflared/config.yml`
- [ ] Füge hinzu:
  ```yaml
  ingress:
    - hostname: api.just-fit.org
      service: http://localhost:11434
      originRequest:
        access:
          required: true
          teamName: <DEIN_TEAM_NAME>
  ```
- [ ] Tunnel neu starten: `cloudflared tunnel run ollama-tunnel`

### 5. Environment Variables setzen
- [ ] Öffne: `apps/web/.env.local`
- [ ] Füge hinzu:
  ```bash
  OLLAMA_HOST=https://api.just-fit.org
  CF_ACCESS_CLIENT_ID=<DEINE_CLIENT_ID>
  CF_ACCESS_CLIENT_SECRET=<DEIN_CLIENT_SECRET>
  ```

### 6. Dev Server neu starten
- [ ] Stop: Ctrl+C
- [ ] Start: `npm run dev`

### 7. Testen
- [ ] Test ohne Token (sollte 403):
  ```bash
  curl https://api.just-fit.org/api/tags
  ```
- [ ] Test mit Token (sollte funktionieren):
  ```bash
  curl https://api.just-fit.org/api/tags \
    -H "CF-Access-Client-Id: <ID>" \
    -H "CF-Access-Client-Secret: <SECRET>"
  ```
- [ ] Test in App: `http://localhost:3000/api/ollama-test`

## 🎯 Zusammenfassung

**Deine Konfiguration ist fast perfekt!** Du musst nur:

1. ✅ Service Token + Access App erstellen (wie beschrieben)
2. ⚠️ **Tunnel Config mit `access.required: true` aktualisieren** (WICHTIG!)
3. ✅ Environment Variables setzen
4. ✅ Testen

Der Code ist bereits fertig und sendet die Headers automatisch! 🚀

