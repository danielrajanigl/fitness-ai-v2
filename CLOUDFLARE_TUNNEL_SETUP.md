# Cloudflare Tunnel Setup & Troubleshooting

## ⚠️ Current Issue: Tunnel URL Not Resolving

The URL `https://partnerships-configuring-legislative-fragrances.trycloudflare.com` is not accessible. This means:

1. **The Cloudflare Tunnel is not running** - You need to start it
2. **The URL has changed** - Cloudflare Tunnel URLs can be temporary

## 🔧 How to Fix

### Step 1: Start/Restart Cloudflare Tunnel

```bash
# If you have cloudflared installed
cloudflared tunnel --url http://localhost:11434
```

This will give you a NEW URL like:
```
https://new-random-name.trycloudflare.com
```

### Step 2: Update Your Environment Variable

Update `apps/web/.env.local` with the NEW URL:

```bash
OLLAMA_HOST=https://new-random-name.trycloudflare.com
```

### Step 3: Restart Your Dev Server

```bash
# Stop with Ctrl+C
npm run dev
```

## 🔒 For Production: Use a Named Tunnel

Temporary URLs (`.trycloudflare.com`) change when you restart. For production:

1. **Create a named tunnel:**
   ```bash
   cloudflared tunnel create fitness-ollama
   ```

2. **Configure the tunnel:**
   ```bash
   cloudflared tunnel route dns fitness-ollama ollama.yourdomain.com
   ```

3. **Run the tunnel:**
   ```bash
   cloudflared tunnel run fitness-ollama
   ```

4. **Update your config file** to point to `http://localhost:11434`

## 🧪 Testing the Tunnel

After starting the tunnel, test it:

```bash
# Test the tunnel URL
curl https://your-tunnel-url.trycloudflare.com

# Should return: "Ollama is running" or similar
```

## 📝 Quick Checklist

- [ ] Cloudflare Tunnel is running (`cloudflared tunnel --url http://localhost:11434`)
- [ ] Got the new URL from the tunnel output
- [ ] Updated `apps/web/.env.local` with the new URL
- [ ] Restarted the dev server
- [ ] Tested the tunnel URL with curl
- [ ] Tested `/api/ollama-test` endpoint

