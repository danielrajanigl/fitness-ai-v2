const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"]
    }
  },
  // Transpile monorepo packages
  transpilePackages: ["@repo/ai", "@repo/supabase"],
  // Cloudflare Pages compatibility
  // Note: Ollama connections may not work on Cloudflare Workers
  // Consider deploying to Vercel, Railway, or another platform for Ollama support
};

export default nextConfig;
