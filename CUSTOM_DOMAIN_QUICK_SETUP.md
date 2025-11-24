# Quick Setup: Custom Domain for Ollama

## 🎯 What You Need
- Domain in Cloudflare ✅ (You have this!)
- Cloudflared installed
- Ollama running on localhost:11434

## 📦 Step 1: Install Cloudflared (if not installed)

**macOS:**
```bash
brew install cloudflared
```

**Or download:**
- Visit: https://github.com/cloudflare/cloudflared/releases
- Download for your OS
- Add to PATH

## 🚀 Step 2: Quick Setup (5 Commands)

```bash
# 1. Create tunnel (replace 'ollama-tunnel' with any name you like)
cloudflared tunnel create ollama-tunnel

# 2. Route DNS (replace with your subdomain, e.g., ollama.yourdomain.com)
cloudflared tunnel route dns ollama-tunnel ollama.yourdomain.com

# 3. Run tunnel (this will show you the config location)
cloudflared tunnel run ollama-tunnel
```

**Note:** The `tunnel run` command will automatically create a config file. You can also create it manually (see below).

## ⚙️ Step 3: Create Config File (Optional - Auto-created)

If you want to customize, create `~/.cloudflared/config.yml`:

```yaml
tunnel: <TUNNEL_ID_FROM_STEP_1>
credentials-file: /Users/danielrajanigl/.cloudflared/<TUNNEL_ID>.json

ingress:
  - hostname: ollama.yourdomain.com
    service: http://localhost:11434
  - service: http_status:404
```

**Replace:**
- `<TUNNEL_ID>` with the ID from `cloudflared tunnel create`
- `ollama.yourdomain.com` with your actual subdomain

## 🔄 Step 4: Update Environment Variable

Edit `apps/web/.env.local`:

```bash
OLLAMA_HOST=https://ollama.yourdomain.com
```

## ✅ Step 5: Test

```bash
# Test DNS
nslookup ollama.yourdomain.com

# Test tunnel
curl https://ollama.yourdomain.com

# Test in your app
# Visit: http://localhost:3000/api/ollama-test
```

## 🔒 Keep Tunnel Running

**Option 1: Keep terminal open**
- Just keep the `cloudflared tunnel run` terminal open

**Option 2: Run as service (Recommended for production)**

**macOS:**
```bash
sudo cloudflared service install
sudo launchctl start com.cloudflare.cloudflared
```

**Linux:**
```bash
sudo cloudflared service install
sudo systemctl start cloudflared
```

## 📝 Example Commands

```bash
# List your tunnels
cloudflared tunnel list

# Check tunnel status
cloudflared tunnel info ollama-tunnel

# Delete tunnel (if needed)
cloudflared tunnel delete ollama-tunnel
```

## 🎉 That's It!

Once set up, your Ollama will be accessible at:
- `https://ollama.yourdomain.com`
- This URL never changes!
- Works from anywhere in the world

## 🆘 Need Help?

See `SETUP_CUSTOM_DOMAIN_TUNNEL.md` for detailed instructions and troubleshooting.

