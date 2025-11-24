# Cloudflare Deployment Notes

## ⚠️ Important: Ollama Connection Limitations

If you're deploying to **Cloudflare Pages** or **Cloudflare Workers**, there are important limitations to be aware of:

### The Problem

1. **External Connection Restrictions**: Cloudflare Workers have restrictions on external HTTP connections, especially to non-standard ports or private IPs.

2. **Ollama Server Location**: If your Ollama server is running on:
   - Your local Mac (`localhost:11434`) - **Won't work** from Cloudflare
   - A private network IP (`192.168.x.x:11434`) - **Won't work** from Cloudflare
   - A publicly accessible server - **May work** but needs proper configuration

### Solutions

#### ✅ Option 1: Cloudflare Tunnel (RECOMMENDED - You're using this!)
**This is the best solution for exposing local Ollama to Cloudflare!**

1. Install Cloudflare Tunnel (cloudflared)
2. Run: `cloudflared tunnel --url http://localhost:11434`
3. Get the public URL (e.g., `https://partnerships-configuring-legislative-fragrances.trycloudflare.com`)
4. Set `OLLAMA_HOST` to your Cloudflare Tunnel URL

**Your current setup:**
```
OLLAMA_HOST=https://partnerships-configuring-legislative-fragrances.trycloudflare.com
```

**Note:** Cloudflare Tunnel URLs are temporary by default. For production:
- Set up a named tunnel with a persistent domain
- Or use a custom domain with Cloudflare Tunnel

#### Option 2: Use a Different Deployment Platform
Deploy to a platform that supports external connections:
- **Vercel** - Full Next.js support, no connection restrictions
- **Railway** - Good for full-stack apps
- **Render** - Supports external connections
- **Fly.io** - Good for edge deployments

#### Option 3: Make Ollama Publicly Accessible
If you must use Cloudflare without Tunnel:
1. Set up Ollama on a publicly accessible server (VPS, cloud instance)
2. Configure proper security (firewall, authentication)
3. Use HTTPS if possible
4. Update `OLLAMA_HOST` to point to the public server

#### Option 4: Use Cloudflare Workers with External Connections
- Check if your Cloudflare plan supports external connections
- Configure allowed origins/domains
- May require Cloudflare Workers Paid plan

### Testing Your Setup

1. **Local Testing**: Make sure `OLLAMA_HOST` works locally first
2. **Network Testing**: Test if your Ollama server is accessible from the internet
3. **Deployment Testing**: Test the connection after deployment

### Environment Variables for Cloudflare

When deploying to Cloudflare Pages:
1. Go to your Cloudflare Pages project settings
2. Add environment variables:
   - `OLLAMA_HOST` - Your publicly accessible Ollama server URL
   - `SUPABASE_URL` - Your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY` - Your service role key
   - `NEXT_PUBLIC_SUPABASE_URL` - Your public Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your anon key

### Recommended Deployment Flow

1. **Development**: Use local Ollama (`OLLAMA_HOST=http://localhost:11434`)
2. **Staging**: Use a test server with public IP
3. **Production**: Use a production server with proper security

---

**Current Status**: The code is configured to use `OLLAMA_HOST` environment variable, which should work once you have a publicly accessible Ollama server.

