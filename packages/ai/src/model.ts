import { Ollama } from "ollama";

// Get Ollama client - reads host dynamically each time to ensure env vars are fresh
function getOllamaClient() {
  const ollamaHost = process.env.OLLAMA_HOST || 'http://localhost:11434';
  const clientId = process.env.CF_ACCESS_CLIENT_ID;
  const clientSecret = process.env.CF_ACCESS_CLIENT_SECRET;
  
  // If Cloudflare Zero Trust credentials are provided, use custom fetch with headers
  if (clientId && clientSecret) {
    // Create custom fetch function with Cloudflare Access headers
    const customFetch = async (url: string, options: RequestInit = {}) => {
      const headers = new Headers(options.headers);
      headers.set('CF-Access-Client-Id', clientId);
      headers.set('CF-Access-Client-Secret', clientSecret);
      
      return fetch(url, {
        ...options,
        headers
      });
    };
    
    return new Ollama({
      host: ollamaHost,
      fetch: customFetch as any
    });
  }
  
  // Default client without authentication
  return new Ollama({
    host: ollamaHost
  });
}

export async function runChat(messages) {
  const client = getOllamaClient();
  return await client.chat({
    model: "mistral:latest",
    messages,
    stream: false,
    options: { temperature: 0.4 }
  });
}

export async function embed(text) {
  try {
    const client = getOllamaClient();
    const res = await client.embeddings({
      model: "qwen2:7b",
      prompt: text
    });

    // Ollama API returns 'embedding' (singular) not 'embeddings' (plural)
    // Check both formats for compatibility
    const embedding = res?.embedding || (res?.embeddings && res.embeddings[0]);
    
    if (!embedding || (Array.isArray(embedding) && embedding.length === 0)) {
      console.error("Embedding response invalid:", res);
      return null;
    }

    // Return the embedding (could be array or direct)
    return Array.isArray(embedding) ? embedding[0] : embedding;
  } catch (error: any) {
    console.error("Embedding error:", error?.message || error);
    console.error("Error details:", {
      message: error?.message,
      code: error?.code,
      name: error?.name
    });
    return null;
  }
}
