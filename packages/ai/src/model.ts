import { Ollama } from "ollama";
import type { ChatMessage, OllamaChatResponse } from "./types";

// Error handling utilities (inline for package independence)
interface RetryConfig {
  maxAttempts: number;
  delayMs: number;
  backoffMultiplier?: number;
  retryableErrors?: string[];
}

class OllamaError extends Error {
  constructor(message: string, public details?: unknown) {
    super(message);
    this.name = "OllamaError";
  }
}

class EmbeddingError extends Error {
  constructor(message: string, public details?: unknown) {
    super(message);
    this.name = "EmbeddingError";
  }
}

async function withRetry<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const maxAttempts = config.maxAttempts || 3;
  const delayMs = config.delayMs || 1000;
  const backoffMultiplier = config.backoffMultiplier || 2;
  const retryableErrors = config.retryableErrors || ["fetch failed", "ECONNREFUSED", "ETIMEDOUT"];
  
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      const errorMessage = error instanceof Error ? error.message : String(error);

      const isRetryable = retryableErrors.some((retryableError) =>
        errorMessage.includes(retryableError)
      );

      if (!isRetryable || attempt === maxAttempts) {
        throw error;
      }

      const delay = delayMs * Math.pow(backoffMultiplier, attempt - 1);
      console.warn(
        `Attempt ${attempt}/${maxAttempts} failed, retrying in ${delay}ms...`,
        errorMessage
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error("Retry failed");
}

function logError(error: unknown, context?: Record<string, unknown>): void {
  const isDevelopment = process.env.NODE_ENV === "development";

  if (error instanceof Error) {
    console.error(`[ERROR] ${error.name}: ${error.message}`, {
      stack: isDevelopment ? error.stack : undefined,
      context,
    });
  } else {
    console.error("[ERROR] Unknown error", { error, context });
  }
}

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
      fetch: customFetch as unknown as typeof fetch
    });
  }
  
  // Default client without authentication
  return new Ollama({
    host: ollamaHost
  });
}

export async function runChat(messages: ChatMessage[]): Promise<OllamaChatResponse> {
  try {
    const client = getOllamaClient();
    
    return await withRetry(
      async () => {
        const response = await client.chat({
          model: "mistral:latest",
          messages,
          stream: false,
          options: { temperature: 0.4 }
        });
        
        if (!response?.message?.content) {
          throw new OllamaError("Invalid response from Ollama", { response });
        }
        
        return response;
      },
      {
        maxAttempts: 3,
        delayMs: 1000,
        retryableErrors: ["fetch failed", "ECONNREFUSED", "ETIMEDOUT"],
      }
    );
  } catch (error) {
    logError(error, { function: "runChat", model: "mistral:latest" });
    throw new OllamaError(
      "Failed to get response from AI model",
      error instanceof Error ? error.message : String(error)
    );
  }
}

// Cache for embeddings (simple in-memory cache)
const embeddingCache = new Map<string, { embedding: number[]; expiresAt: number }>();

export async function embed(text: string, useCache: boolean = true): Promise<number[] | null> {
  // Check cache first
  if (useCache) {
    const cacheKey = text.trim().toLowerCase();
    const cached = embeddingCache.get(cacheKey);
    if (cached && Date.now() < cached.expiresAt) {
      return cached.embedding;
    }
  }
  try {
    const client = getOllamaClient();
    
    const res = await withRetry(
      async () => {
        return await client.embeddings({
          model: "qwen2:7b",
          prompt: text
        });
      },
      {
        maxAttempts: 3,
        delayMs: 1000,
        retryableErrors: ["fetch failed", "ECONNREFUSED", "ETIMEDOUT"],
      }
    );

    // Ollama API returns 'embedding' (singular) not 'embeddings' (plural)
    // Check both formats for compatibility
    const embedding = res?.embedding || (res?.embeddings && res.embeddings[0]);
    
    if (!embedding || (Array.isArray(embedding) && embedding.length === 0)) {
      logError(new Error("Invalid embedding response"), { response: res });
      throw new EmbeddingError("Invalid embedding response from Ollama", { response: res });
    }

    // Return the embedding (could be array or direct)
    const result = Array.isArray(embedding) ? embedding[0] : embedding;
    
    if (!Array.isArray(result) || result.length === 0) {
      throw new EmbeddingError("Embedding is not a valid array", { embedding: result });
    }
    
    // Cache the result (24 hour TTL for embeddings)
    if (useCache) {
      const cacheKey = text.trim().toLowerCase();
      embeddingCache.set(cacheKey, {
        embedding: result,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      });
    }
    
    return result;
  } catch (error) {
    logError(error, { function: "embed", model: "qwen2:7b", textLength: text.length });
    
    if (error instanceof EmbeddingError) {
      throw error;
    }
    
    throw new EmbeddingError(
      "Failed to generate embedding",
      error instanceof Error ? error.message : String(error)
    );
  }
}
