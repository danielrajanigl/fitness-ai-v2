import { NextResponse } from "next/server";
import { embed } from "@repo/ai";
import { Ollama } from "ollama";

export async function GET() {
  const results: any = {
    timestamp: new Date().toISOString(),
    ollamaHost: process.env.OLLAMA_HOST || 'NOT SET',
    hasZeroTrust: !!(process.env.CF_ACCESS_CLIENT_ID && process.env.CF_ACCESS_CLIENT_SECRET),
    tests: []
  };

  // Test 1: Check available models
  try {
    const clientId = process.env.CF_ACCESS_CLIENT_ID;
    const clientSecret = process.env.CF_ACCESS_CLIENT_SECRET;
    const ollamaHost = process.env.OLLAMA_HOST || 'https://llm.just-fit.org';
    
    const customFetch = clientId && clientSecret ? async (url: string, options: RequestInit = {}) => {
      const headers = new Headers(options.headers);
      headers.set('CF-Access-Client-Id', clientId);
      headers.set('CF-Access-Client-Secret', clientSecret);
      return fetch(url, { ...options, headers });
    } : undefined;

    const client = new Ollama({
      host: ollamaHost,
      fetch: customFetch as any
    });

    const models = await client.list();
    results.tests.push({
      name: 'Available Models',
      success: true,
      models: models.models?.map((m: any) => ({
        name: m.name,
        size: m.size,
        modified: m.modified_at
      })) || []
    });
  } catch (error: any) {
    results.tests.push({
      name: 'Available Models',
      success: false,
      error: error?.message
    });
  }

  // Test 2: Try embedding with our function
  try {
    const embedding = await embed("test");
    results.tests.push({
      name: 'Embedding Test',
      success: !!embedding,
      hasEmbedding: !!embedding,
      dimension: embedding?.length || 0,
      embeddingPreview: embedding ? embedding.slice(0, 5) : null
    });
  } catch (error: any) {
    results.tests.push({
      name: 'Embedding Test',
      success: false,
      error: error?.message,
      stack: error?.stack
    });
  }

  // Test 3: Try embedding directly with Ollama client
  try {
    const clientId = process.env.CF_ACCESS_CLIENT_ID;
    const clientSecret = process.env.CF_ACCESS_CLIENT_SECRET;
    const ollamaHost = process.env.OLLAMA_HOST || 'https://llm.just-fit.org';
    
    const customFetch = clientId && clientSecret ? async (url: string, options: RequestInit = {}) => {
      const headers = new Headers(options.headers);
      headers.set('CF-Access-Client-Id', clientId);
      headers.set('CF-Access-Client-Secret', clientSecret);
      return fetch(url, { ...options, headers });
    } : undefined;

    const client = new Ollama({
      host: ollamaHost,
      fetch: customFetch as any
    });

    const res = await client.embeddings({
      model: "qwen2:7b",
      prompt: "test"
    });

    // Ollama returns 'embedding' (singular) not 'embeddings' (plural)
    const embedding = res?.embedding || (res?.embeddings && res.embeddings[0]);
    const embeddingArray = Array.isArray(embedding) ? embedding : (embedding ? [embedding] : []);

    results.tests.push({
      name: 'Direct Embedding API Test',
      success: true,
      hasResponse: !!res,
      hasEmbedding: !!res?.embedding,
      hasEmbeddings: !!(res?.embeddings),
      embeddingLength: Array.isArray(res?.embedding) ? res.embedding.length : (res?.embedding ? res.embedding.length : 0),
      embeddingsCount: res?.embeddings?.length || 0,
      firstEmbeddingLength: embeddingArray[0]?.length || 0,
      responseKeys: res ? Object.keys(res) : [],
      responseStructure: {
        hasEmbedding: !!res?.embedding,
        hasEmbeddings: !!res?.embeddings,
        embeddingType: res?.embedding ? (Array.isArray(res.embedding) ? 'array' : typeof res.embedding) : 'none'
      }
    });
  } catch (error: any) {
    results.tests.push({
      name: 'Direct Embedding API Test',
      success: false,
      error: error?.message,
      errorCode: error?.code,
      errorName: error?.name
    });
  }

  return NextResponse.json(results);
}

