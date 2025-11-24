# Quick Start: Cloudflare Tunnel for Ollama

## 🚨 Current Issue: Tunnel Not Running

The Cloudflare Tunnel URL is not accessible. You need to start the tunnel and update the URL.

## ⚡ Quick Fix (3 Steps)

### Step 1: Start Cloudflare Tunnel

Open a **new terminal window** and run:

```bash
cloudflared tunnel --url http://localhost:11434
```

**Important:** Keep this terminal window open! The tunnel must stay running.

### Step 2: Copy the New URL

You'll see output like:
```
+--------------------------------------------------------------------------------------------+
|  Your quick Tunnel has been created! Visit it at (it may take some time to be reachable): |
|  https://NEW-RANDOM-NAME.trycloudflare.com                                                 |
+--------------------------------------------------------------------------------------------+
```

**Copy the URL** (it will be different from the old one!)

### Step 3: Update Environment Variable

Update `apps/web/.env.local`:

```bash
OLLAMA_HOST=https://NEW-RANDOM-NAME.trycloudflare.com
```

Replace `NEW-RANDOM-NAME` with the actual URL from Step 2.

### Step 4: Restart Dev Server

```bash
# Stop with Ctrl+C
npm run dev
```

## ✅ Verify It Works

1. **Test the tunnel directly:**
   ```bash
   curl https://your-new-url.trycloudflare.com
   ```
   Should return: "Ollama is running" or similar

2. **Test via API:**
   - Visit: `http://localhost:3000/api/test-tunnel`
   - Should show: `"success": true`

3. **Test Ollama connection:**
   - Visit: `http://localhost:3000/api/ollama-test`
   - Should show: `"connection": "✅ Connected successfully"`

## 🔒 Important Notes

- **Keep the tunnel terminal running** - If you close it, the URL stops working
- **URLs are temporary** - Each time you restart the tunnel, you get a new URL
- **For production:** Set up a named tunnel with a persistent domain (see `CLOUDFLARE_TUNNEL_SETUP.md`)

## 🐛 Troubleshooting

**"Could not resolve host"**
- Tunnel is not running → Start it in a separate terminal

**"Connection refused"**
- Ollama is not running on localhost:11434 → Start Ollama first

**"fetch failed"**
- URL changed → Get new URL from tunnel output and update .env.local

## 📝 Current Status

- ✅ Code is configured correctly
- ✅ Environment variable structure is correct
- ❌ Cloudflare Tunnel needs to be started
- ❌ OLLAMA_HOST needs to be updated with new URL

