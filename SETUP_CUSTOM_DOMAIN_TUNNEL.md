# Setup Cloudflare Tunnel with Custom Domain for Ollama

## 🎯 Goal
Set up a persistent Cloudflare Tunnel using your custom domain instead of temporary URLs.

## 📋 Prerequisites
- Domain purchased in Cloudflare
- Cloudflared installed (`cloudflared` command available)
- Ollama running on `localhost:11434`

## 🚀 Step-by-Step Setup

### Step 1: Create a Named Tunnel

```bash
cloudflared tunnel create ollama-tunnel
```

This will create a tunnel and give you a tunnel ID. **Save this ID!**

### Step 2: Create Tunnel Configuration File

Create a config file (usually `~/.cloudflared/config.yml` or `~/.cloudflared/config.yaml`):

```yaml
tunnel: <YOUR_TUNNEL_ID>
credentials-file: /Users/danielrajanigl/.cloudflared/<TUNNEL_ID>.json

ingress:
  # Route Ollama API to localhost
  - hostname: ollama.yourdomain.com
    service: http://localhost:11434
  # Catch-all rule (must be last)
  - service: http_status:404
```

**Replace:**
- `<YOUR_TUNNEL_ID>` with the ID from Step 1
- `ollama.yourdomain.com` with your desired subdomain (e.g., `ollama.example.com`)
- `yourdomain.com` with your actual domain

### Step 3: Route DNS to the Tunnel

```bash
cloudflared tunnel route dns ollama-tunnel ollama.yourdomain.com
```

This creates a DNS record pointing your subdomain to the tunnel.

**Alternative (Manual DNS):**
1. Go to Cloudflare Dashboard → Your Domain → DNS
2. Add a CNAME record:
   - **Name:** `ollama` (or your subdomain)
   - **Target:** `<TUNNEL_ID>.cfargotunnel.com`
   - **Proxy:** Proxied (orange cloud)

### Step 4: Run the Tunnel

```bash
cloudflared tunnel run ollama-tunnel
```

**For Production (Run as Service):**

**macOS (using launchd):**
```bash
# Install the service
sudo cloudflared service install

# Start the service
sudo launchctl start com.cloudflare.cloudflared
```

**Linux (using systemd):**
```bash
# Install the service
sudo cloudflared service install

# Start the service
sudo systemctl start cloudflared
```

### Step 5: Update Environment Variable

Update `apps/web/.env.local`:

```bash
OLLAMA_HOST=https://ollama.yourdomain.com
```

Replace `ollama.yourdomain.com` with your actual subdomain.

### Step 6: Restart Dev Server

```bash
# Stop with Ctrl+C
npm run dev
```

## ✅ Verify Setup

1. **Test DNS resolution:**
   ```bash
   nslookup ollama.yourdomain.com
   ```
   Should resolve to a Cloudflare IP.

2. **Test tunnel directly:**
   ```bash
   curl https://ollama.yourdomain.com
   ```
   Should return: "Ollama is running" or similar.

3. **Test via API:**
   - Visit: `http://localhost:3000/api/test-tunnel`
   - Should show: `"success": true`

4. **Test Ollama connection:**
   - Visit: `http://localhost:3000/api/ollama-test`
   - Should show: `"connection": "✅ Connected successfully"`

## 🔒 Security Considerations

### Option 1: Add Authentication Header (Recommended)

Update your tunnel config to require a header:

```yaml
tunnel: <YOUR_TUNNEL_ID>
credentials-file: /Users/danielrajanigl/.cloudflared/<TUNNEL_ID>.json

ingress:
  - hostname: ollama.yourdomain.com
    service: http://localhost:11434
    originRequest:
      access:
        required: true
        teamName: your-team-name
  - service: http_status:404
```

Then add the header in your code (optional, for extra security).

### Option 2: Use Cloudflare Access (More Secure)

1. Go to Cloudflare Dashboard → Zero Trust → Access
2. Create an application for `ollama.yourdomain.com`
3. Set up authentication policies
4. Only authenticated users can access Ollama

### Option 3: IP Allowlist

In Cloudflare Dashboard → WAF → Tools:
- Add IP allowlist rules
- Only allow your server IPs

## 📝 Configuration File Locations

**macOS/Linux:**
- `~/.cloudflared/config.yml`

**Windows:**
- `%USERPROFILE%\.cloudflared\config.yml`

## 🐛 Troubleshooting

**"Tunnel not found"**
- Make sure you're using the correct tunnel ID
- Check credentials file path

**"DNS not resolving"**
- Wait a few minutes for DNS propagation
- Check Cloudflare DNS dashboard
- Verify CNAME record is correct

**"Connection refused"**
- Make sure Ollama is running: `curl http://localhost:11434`
- Check tunnel is running: `cloudflared tunnel list`

**"502 Bad Gateway"**
- Tunnel is running but can't reach localhost:11434
- Check Ollama is running
- Verify service URL in config

## 🔄 Update Existing Setup

If you already have a tunnel running with temporary URL:

1. **Stop the temporary tunnel** (Ctrl+C in that terminal)
2. **Follow steps above** to create named tunnel
3. **Update `apps/web/.env.local`** with new domain
4. **Restart dev server**

## 📚 Additional Resources

- [Cloudflare Tunnel Docs](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)
- [Named Tunnel Setup](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/tunnel-guide/)
- [DNS Routing](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/routing-to-tunnel/dns/)

## 🎉 Benefits of Custom Domain

✅ **Persistent URL** - Never changes  
✅ **Professional** - Use your own domain  
✅ **Reliable** - No temporary URL expiration  
✅ **Secure** - Can add Cloudflare Access  
✅ **Production-ready** - Perfect for deployment  

